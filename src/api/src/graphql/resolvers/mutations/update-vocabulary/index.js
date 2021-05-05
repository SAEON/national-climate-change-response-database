import { createReadStream } from 'fs'
import { join } from 'path'
import getCurrentDirectory from '../../../../lib/get-current-directory.js'
import csv from 'csv'
import { performance } from 'perf_hooks'
const { parse } = csv

const __dirname = getCurrentDirectory(import.meta)

const VOCABULARIES = [
  'regions.csv',
  'hazards.csv',
  'mitigation-sectors.csv',
  'mitigation-types.csv',
  'lead-sectors.csv',
]

export default async (_, args, ctx) => {
  const { query } = ctx.mssql

  try {
    const t0 = performance.now()
    for (const VOCABULARY of VOCABULARIES) {
      console.info('Loading vocabulary', VOCABULARY, 'into database')

      const parser = createReadStream(join(__dirname, `./trees/${VOCABULARY}`)).pipe(
        parse({ columns: true })
      )

      for await (let { parent, term, tree } of parser) {
        parent = parent.trim()
        term = term.trim()
        tree = tree.trim()

        /**
         * Make sure that the tree exists in the database
         */
        await query(`
          merge VocabularyTrees T
          using (select '${tree}' name) S on T.name = S.name
          when not matched then insert (name)
          values ('${tree}');`)

        /**
         * Make sure that the terms (parent and child) exists in the database
         */
        await query(`
          merge Vocabulary T
          using (
            select distinct *
            from (
              select '${term}' term
              union
              select '${parent}' term	
            ) t
            where term <> '' and term <> ''
          ) S on T.term = S.term
          when not matched then insert (term)
          values (S.term);`)

        /**
         * Make sure term is associated with this tree
         */
        await query(`
          merge VocabularyXrefTree T
          using (
            select 
              (select id from Vocabulary where term = '${term}') vocabularyId,
              (select id from VocabularyTrees where name = '${tree}') vocabularyTreeId
          ) S on S.vocabularyId = T.vocabularyId and S.vocabularyTreeId = T.vocabularyTreeId
          when not matched then insert (vocabularyId, vocabularyTreeId)
          values (S.vocabularyId, S.vocabularyTreeId);`)

        /**
         * Insert this tree link
         */
        await query(`
          merge VocabularyXrefVocabulary T
          using (
            select * from (
              select
                (select id from Vocabulary where term = '${parent}') parentId,
                (select id from Vocabulary where term = '${term}') childId,
                (select id from VocabularyTrees where name = '${tree}') vocabularyTreeId
            ) t where parentId <> ''
          ) S on
          S.parentId = T.parentId
          and S.childId = T.childId
          and S.vocabularyTreeId = T.vocabularyTreeId
          when not matched then insert (parentId, childId, vocabularyTreeId)
          values (S.parentId, S.childId, S.vocabularyTreeId);`)
      }
    }

    const t1 = performance.now()
    const runtime = `${Math.round((t1 - t0) / 1000, 2)} seconds`
    console.info('Vocabularies loaded!', runtime)
    return { okay: true, runtime }
  } catch (error) {
    return {
      okay: false,
      error: error.message,
    }
  }
}

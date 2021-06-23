import { createReadStream, readdirSync } from 'fs'
import { join } from 'path'
import getCurrentDirectory from '../../../../../lib/get-current-directory.js'
import csv from 'csv'
import { performance } from 'perf_hooks'
const { parse } = csv

const __dirname = getCurrentDirectory(import.meta)

export default async ctx => {
  const VOCABULARIES = readdirSync(join(__dirname, './trees')).sort()

  const { query } = ctx.mssql

  try {
    const t0 = performance.now()
    for (const VOCABULARY of VOCABULARIES) {
      console.info('Loading vocabulary', VOCABULARY, 'into database')

      const parser = createReadStream(join(__dirname, `./trees/${VOCABULARY}`)).pipe(
        parse({ columns: true, skipEmptyLines: true })
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
          using (select '${sanitizeSqlValue(tree)}' name) S on T.name = S.name
          when not matched then insert (name)
          values (S.name);`)

        /**
         * Make sure that the terms (parent and child) exists in the database
         */
        await query(`
          merge Vocabulary T
          using (
            select distinct *
            from (
              select '${sanitizeSqlValue(term)}' term
              union
              select '${sanitizeSqlValue(parent)}' term	
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
              (select id from Vocabulary where term = '${sanitizeSqlValue(term)}') vocabularyId,
              (select id from VocabularyTrees where name = '${sanitizeSqlValue(
                tree
              )}') vocabularyTreeId
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
                (select id from Vocabulary where term = '${sanitizeSqlValue(parent)}') parentId,
                (select id from Vocabulary where term = '${sanitizeSqlValue(term)}') childId,
                (select id from VocabularyTrees where name = '${sanitizeSqlValue(
                  tree
                )}') vocabularyTreeId
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

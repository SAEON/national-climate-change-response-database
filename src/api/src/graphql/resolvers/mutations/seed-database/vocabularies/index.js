import { createReadStream, readdirSync } from 'fs'
import { join } from 'path'
import getCurrentDirectory from '../../../../../lib/get-current-directory.js'
import { parse } from 'csv'
import { performance } from 'perf_hooks'
import { pool } from '../../../../../mssql/pool.js'
import mssql from 'mssql'

const __dirname = getCurrentDirectory(import.meta)

export default async () => {
  const VOCABULARIES = readdirSync(join(__dirname, './trees')).sort()

  try {
    const t0 = performance.now()
    for (const VOCABULARY of VOCABULARIES) {
      console.info('Loading vocabulary', VOCABULARY, 'into database')

      const parser = createReadStream(join(__dirname, `./trees/${VOCABULARY}`)).pipe(
        parse({ columns: true, skipEmptyLines: true })
      )

      /**
       * Each tree is processed into the DB as a single
       * transaction
       */
      const transaction = new mssql.Transaction(await pool.connect())
      await transaction.begin()

      try {
        for await (let { parent, term, tree } of parser) {
          parent = parent.trim()
          term = term.trim()
          tree = tree.trim()

          /**
           * Make sure that the tree exists in the database
           */
          await transaction.request().input('tree', tree).query(`
            merge Trees T
            using (select @tree name) S on T.name = S.name
            when not matched then insert (name)
            values (S.name);`)

          /**
           * Make sure that the terms (parent and child) exists in the database
           */
          await transaction.request().input('term', term).input('parent', parent).query(`
            merge Vocabulary T
            using (
              select distinct *
              from (
                select @term term
                union
                select @parent term	
              ) t
              where term <> '' and term <> ''
            ) S on T.term = S.term
            when not matched then insert (term)
            values (S.term);`)

          /**
           * Make sure term is associated with this tree
           */
          await transaction.request().input('term', term).input('tree', tree).query(`
            merge VocabularyXrefTree T
            using (
              select 
                (select id from Vocabulary where term = @term) vocabularyId,
                (select id from Trees where name = @tree) treeId
            ) S on S.vocabularyId = T.vocabularyId and S.treeId = T.treeId
            when not matched then insert (vocabularyId, treeId)
            values (S.vocabularyId, S.treeId);`)

          /**
           * Insert this tree link
           */
          await transaction
            .request()
            .input('parent', parent)
            .input('term', term)
            .input('tree', tree).query(`
              merge VocabularyXrefVocabulary T
              using (
                select * from (
                  select
                    (select id from Vocabulary where term = @parent) parentId,
                    (select id from Vocabulary where term = @term) childId,
                    (select id from Trees where name = @tree) treeId
                ) t where parentId <> ''
              ) S on
              S.parentId = T.parentId
              and S.childId = T.childId
              and S.treeId = T.treeId
              when not matched then insert (parentId, childId, treeId)
              values (S.parentId, S.childId, S.treeId);`)
        }
      } catch (error) {
        console.error('Unable to load vocabulary tree', error)
        await transaction.rollback()
      }

      await transaction.commit()
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

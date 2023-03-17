import { pool } from '../pool.js'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import { createReadStream, readdir } from 'fs'
import { join, sep } from 'path'
import { parse } from 'csv'
import { performance } from 'perf_hooks'
import mssql from 'mssql'
import logger from '../../lib/logger.js'

const __dirname = getCurrentDirectory(import.meta)

export default async () => {
  const t0 = performance.now()

  const VOCABULARIES = await new Promise((y, n) =>
    readdir(join(__dirname, `.${sep}trees`), {}, (e, files) => (e ? n(e) : y(files.sort())))
  )

  /**
   * All trees are loaded in a single transaction
   */
  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  try {
    /**
     * First reset the vocabulary model
     */
    await transaction.request().query('delete from VocabularyXrefVocabulary;')
    await transaction.request().query('delete from VocabularyXrefRegion;')
    await transaction.request().query('delete from VocabularyXrefTree;')
    await transaction.request().query('delete from Trees;')
    await transaction.request().query('delete from Vocabulary;')

    for (const VOCABULARY of VOCABULARIES) {
      logger.info('Loading vocabulary', VOCABULARY, 'into database')

      const parser = createReadStream(join(__dirname, `.${sep}trees${sep}${VOCABULARY}`)).pipe(
        parse({ columns: true, skipEmptyLines: true })
      )

      for await (let { parent, term, tree, ...properties } of parser) {
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
         * Append any properties to this vocabulary term
         */
        await transaction
          .request()
          .input('term', term)
          .input('properties', JSON.stringify(properties)).query(`
            update Vocabulary
              set properties = @properties
              where term = @term;`)

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
        await transaction.request().input('parent', parent).input('term', term).input('tree', tree)
          .query(`
              merge VocabularyXrefVocabulary T
              using (
                select * from (
                  select
                    (select id from Vocabulary where term = @parent) parentId,
                    (select id from Vocabulary where term = @term) childId,
                    (select id from Trees where name = @tree) treeId
                ) t where parentId <> ''
              ) S on S.parentId = T.parentId
                and S.childId = T.childId
                and S.treeId = T.treeId
              when not matched then insert (parentId, childId, treeId)
              values (S.parentId, S.childId, S.treeId);`)
      }
    }

    /**
     * Loop through region terms,
     * and associate each region term with
     * a region vocabulary
     *
     * It's better to do this in many statements
     * to make it easier to find where terms and
     * names in the regions table diverge
     */
    const terms = await transaction
      .request()
      .query(
        `select distinct
          v.id,
          v.code

        from Trees t
        join VocabularyXrefTree x on x.treeId = t.id
        join Vocabulary v on v.id = x.vocabularyId

        where
          t.name = 'regions';`
      )
      .then(({ recordset: r }) => r)

    for (const { id: vocabularyId, code } of terms) {
      await transaction.request().input('vocabularyId', vocabularyId).input('code', code).query(`
        merge VocabularyXrefRegion t
        using (
          select
            @vocabularyId vocabularyId,
            ( select id from Regions where code = @code ) regionId
        ) s on s.vocabularyId = t.vocabularyId and s.regionId = t.regionId
        when not matched
          then insert (vocabularyId, regionId)
          values (s.vocabularyId, s.regionId);`)
    }

    await transaction.commit()

    const t1 = performance.now()
    const runtime = `${Math.round((t1 - t0) / 1000, 2)} seconds`
    logger.info('Vocabularies loaded!', runtime)
  } catch (error) {
    logger.error('Error loading vocabulary trees', error)
    await transaction.rollback()
    throw error
  }
}

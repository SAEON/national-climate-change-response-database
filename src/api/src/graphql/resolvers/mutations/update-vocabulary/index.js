import { createReadStream } from 'fs'
import { join } from 'path'
import getCurrentDirectory from '../../../../lib/get-current-directory.js'
import csv from 'csv'
const { parse } = csv

const __dirname = getCurrentDirectory(import.meta)

const VOCABULARIES = [
  'regions.csv',
  'hazards.csv',
  'mitigation-sector.csv',
  'mitigation-type.csv',
  'sic-sector.csv',
]

export default async (_, args, ctx) => {
  const { Vocabulary } = await ctx.mongo.collections

  try {
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
         * Make sure that the term is in the
         * database and includes a reference
         * to this tree
         */
        const child = await Vocabulary.findOneAndUpdate(
          { term },
          {
            $setOnInsert: {
              term,
              createdAt: new Date(),
              createdBy: 'TODO',
              children: [],
            },
            $set: {
              modifiedAt: new Date(),
              modifiedBy: 'TODO',
            },
            $addToSet: {
              trees: tree,
            },
          },
          {
            returnOriginal: true,
            upsert: true,
          }
        )

        const childId = child.value?._id || child.lastErrorObject.upserted

        /**
         * If parent is not defined, this is
         * the root node - just return here
         */
        if (!parent) {
          continue
        }

        /**
         * Make sure the parent is also a term
         * in the database, that includes a
         * reference to this term in the children
         * array, and that the parent term also
         * is associated with this tree.
         *
         * This just allows for rows in the CSV
         * to be in any order (parent or child first)
         */
        await Vocabulary.findOneAndUpdate(
          { term: parent },
          {
            $setOnInsert: {
              term: parent,
              createdAt: new Date(),
              createdBy: 'TODO',
            },
            $set: {
              modifiedAt: new Date(),
              modifiedBy: 'TODO',
            },
            $addToSet: {
              trees: tree,
              children: childId,
            },
          },
          {
            returnOriginal: false,
            upsert: true,
          }
        )
      }
    }

    console.info('Vocabularies loaded!')
    return { okay: true }
  } catch (error) {
    return {
      okay: false,
      error: error.message,
    }
  }
}

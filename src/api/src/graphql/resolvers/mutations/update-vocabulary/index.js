import { createReadStream } from 'fs'
import { join } from 'path'
import getCurrentDirectory from '../../../../lib/get-current-directory.js'
import csv from 'csv'
const { parse } = csv

const __dirname = getCurrentDirectory(import.meta)

export default async (_, args, ctx) => {
  const { Vocabulary } = await ctx.mongo.collections

  try {
    const parser = createReadStream(join(__dirname, './vocab.csv')).pipe(parse({ columns: true }))

    for await (const { parent, term, tree } of parser) {
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
    return { okay: true }
  } catch (error) {
    return {
      okay: false,
      error: error.message,
    }
  }
}

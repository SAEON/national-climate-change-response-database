const BATCH_SIZE = 1000

export default collections => {
  return class LogBatcher {
    constructor() {
      this._queries = []
    }

    load(...queries) {
      this._queries.push(...queries)

      process.nextTick(async () => {
        if (!this._queries.length) {
          return
        }

        const batch = this._queries.slice(0, BATCH_SIZE)
        this._queries = this._queries.slice(BATCH_SIZE)

        try {
          const { Logs } = await collections
          const { insertedCount } = await Logs.insertMany(batch)
          console.log('Client events logged', insertedCount)
        } catch (error) {
          console.error(
            'Error logging client events to Mongo (ignore this unless very frequent).',
            error.message
          )
        } finally {
          this.load()
        }
      })
    }
  }
}

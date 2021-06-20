const Record = require('../record')
const { records } = require('../../records.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  Record.create(records)
    .then(() => [
      console.log('done')
    ])
})
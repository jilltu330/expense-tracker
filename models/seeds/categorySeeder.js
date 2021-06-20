const Category = require('../category')
const { categories } = require('../../categories.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  Category.create(categories)
  console.log('done')
})
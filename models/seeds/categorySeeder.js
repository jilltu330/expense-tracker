const mongoose = require('mongoose')

const Category= require('../category')
const { categories } = require('../../categories.json')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  Category.create(categories)
  console.log('done')
})
const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

const { dateConvert } = require('../../public/javascripts/functions')

//Create route
router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .then(categories => res.render('new', { categories }))
})

router.post('/', (req, res) => {
  const name = req.body.name
  const date = req.body.date
  const category = req.body.category
  const amount = req.body.amount

  return Record.create({ name, date, category, amount })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//Edit route
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Promise.all([Record.findById(id).lean(), Category.find().lean()])
    .then(results => {
      const [record, categories] = results
      record.date = dateConvert(record.date)
      const category = record.category
      res.render('edit', { record, category, categories })
    })
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const date = req.body.date
  const category = req.body.category
  const amount = req.body.amount

  return Record.findById(id)
    .then(record => {
      record.name = name
      record.date = date
      record.category = category
      record.amount = amount
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//Delete route
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
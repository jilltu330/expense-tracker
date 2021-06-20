const express = require("express")
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const hbshelpers = require('handlebars-helpers')
const helpers = hbshelpers()

const Record = require('./models/record')
const Category = require('./models/category')
const record = require("./models/record")

const app = express()
const PORT = 3000

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

//home route
app.get('/', (req, res) => {
  const filterBy = req.query.filterBy
  const query = filterBy === undefined ? undefined : { category: filterBy }
  Promise.all([Record.find(query).lean().sort('-date'), Category.find().lean()]).then(results => {
    const [records, categories] = results
    let totalAmount = 0
    records.forEach(record => {
      record.date = dateConvert(record.date)
      totalAmount += record.amount
      const category = categories.find(category => category.name === record.category)
      if (category) {
        record.icon = category.icon
      }
    })
    res.render('index', { records, categories, totalAmount, filterBy })
  }).catch(err => console.log(err))
})

//Create route
app.get('/expenses/new', (req, res) => {
  Category.find()
    .lean()
    .then(categories => res.render('new', { categories }))
})

app.post('/expenses', (req, res) => {
  const name = req.body.name
  const date = req.body.date
  const category = req.body.category
  const amount = req.body.amount

  return Record.create({ name, date, category, amount })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//Edit route
app.get('/expenses/:id/edit', (req, res) => {
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

app.post('/expenses/:id/edit', (req, res) => {
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



app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})

// functions
function dateConvert(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const mStr = month > 9 ? month : '0' + month
  const dStr = day > 9 ? day : '0' + day
  return `${year}-${mStr}-${dStr}`
}
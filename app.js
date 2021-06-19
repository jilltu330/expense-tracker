const express = require("express")
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

const Record = require('./models/record')
const Category = require('./models/category')

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


app.get('/', (req, res) => {

  // Record.find().lean().sort('-date').then(records => {
  //   Category.find().lean().then(categories => {
  //     console.log('record:' + records.length + ',categories:' + categories.length)
  //   })
  // })

  Promise.all([Record.find().lean().sort('-date'), Category.find().lean()]).then(results => {
    const [records, categories] = results
    let totalAmount = 0
    records.forEach(record => {
      record.date = dateConvert(record.date)
      totalAmount += record.amount
      const category = categories.find(category => category.name === record.category)
      if(category){
        record.icon = category.icon
      }
    })
    res.render('index', { records, categories, totalAmount})
  })

})

function dateConvert(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const mStr = month > 9 ? month : '0' + month
  const dStr = day > 9 ? day : '0' + day
  return `${year}/${mStr}/${dStr}`
}


app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
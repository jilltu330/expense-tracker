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
  const totalAmount = 0
  const categories = [
    {
      "name": "家居物業",
      "icon": "fas fa-home"
    },
    {
      "name": "交通出行",
      "icon": "fas fa-shuttle-van"
    },
    {
      "name": "休閒娛樂",
      "icon": "fas fa-grin-beam"
    },
    {
      "name": "餐飲食品",
      "icon": "fas fa-utensils"
    },
    {
      "name": "其他",
      "icon": "fas fa-pen"
    }
  ]
  const records = [
    {
      "name": "買菜",
      "category": "餐飲食品",
      "date": "2021-05-24",
      "amount": 680
    },
    {
      "name": "機車加油",
      "category": "交通出行",
      "date": "2021-05-28",
      "amount": 100
    },
    {
      "name": "桌遊",
      "category": "休閒娛樂",
      "date": "2021-05-30",
      "amount": 450
    },
  ]
  res.render('index', { records, categories })

})


app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
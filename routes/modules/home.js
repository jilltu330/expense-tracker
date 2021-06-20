const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

const { dateConvert } = require('../../public/javascripts/functions')

//home route
router.get('/', (req, res) => {
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

module.exports = router
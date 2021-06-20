const express = require('express')

const router = express.Router()

const home = require('./modules/home')
const expenses = require('./modules/expenses')

router.use('/', home)
router.use('/expenses', expenses)

module.exports = router
const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.set('Content-Type', 'text/html')
  res.send('../html/index.html')
})
router.get('*', function (req, res, next) {
  res.set('Content-Type', 'text/html')
  res.send('../html/*')
})

module.exports = router

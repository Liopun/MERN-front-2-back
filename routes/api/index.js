var express = require('express'),
    router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ title: 'Hello Express' })
});

module.exports = router

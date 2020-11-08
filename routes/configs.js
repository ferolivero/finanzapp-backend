var express = require('express');
const authMiddleware = require('../middleware/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', authMiddleware.auth, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

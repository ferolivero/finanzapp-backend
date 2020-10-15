var express = require('express');
var router = express.Router();
const jwt = require('njwt')

router.get('/token', function(req, res, next) {
  // Aca deberia realizar la validacion del login
  const token = jwt.create('Grupo2-SecretKey')
  token.setExpiration(new Date().getTime() + 15*60*1000)
  res.send(token.compact())
});

module.exports = router;

const dotenv = require('dotenv/config');
const express = require('express');
const router = express.Router();
const jwt = require('njwt')
const userData = require('./../data/usersData');

router.get('/token', async function(req, res, next) {
  // Aca deberia realizar la validacion del login

  let user = await userData.getUser(1);
  console.log(user);

  const token = jwt.create(process.env.JWT_SECRET_KEY);
  token.setExpiration(new Date().getTime() + 15*60*1000)
  res.send(token.compact())
});


module.exports = router;

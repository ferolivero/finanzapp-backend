const dotenv = require('dotenv').config();
const express = require('express');
const ObjectID = require('mongodb').ObjectID
const router = express.Router();
const user = require('../data/user');
const authMiddleware = require('./../middleware/auth')

router.get('/token', async function(req, res, next) {
  const { idtoken } = req.headers;
  const payload = await authMiddleware.verify(idtoken);
  console.log('email', payload.email)
  if (payload.email){
    const usuario = await user.getUsuario(payload.email.toString());
    console.log(usuario);
    if (!usuario) {
      console.log('Creo el usuario en la base de datos')
      usuario = {_id: payload.email, nombre: payload.name, foto: payload.picture, moneda: "$"};
      await user.pushUsuario(usuario);
    }
  
    const token = await authMiddleware.generateTokenAuth(usuario);
    console.log({token})
    res.send(token)
  } else {
    res.status(409).send("Email invalido");
  }

});

module.exports = router;

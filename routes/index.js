const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const userData = require('../data/user');
const authMiddleware = require('./../middleware/auth')

router.get('/token', async function(req, res, next) {
  try {
    const { idtoken } = req.headers;
    const payload = await authMiddleware.verify(idtoken);
    console.log('email', payload.email)
    if (payload.email){
      const usuario = await userData.getUsuario({id: payload.email.toString()});
      console.log(usuario);
      if (!usuario) {
        console.log('Creo el usuario en la base de datos')
        usuario = {_id: payload.email, nombre: payload.name, foto: payload.picture, moneda: "$"};
        await userData.pushUsuario(usuario);
      }
    
      const token = await authMiddleware.generateTokenAuth(usuario);
      console.log({token})
      res.send(token)
    } else {
      res.status(409).send("Email invalido");
    }
  } catch (err) {
    res.status(401).send({error: err.message});
  }

});

module.exports = router;

const dotenv = require('dotenv').config();
const express = require('express');
const ObjectID = require('mongodb').ObjectID
const router = express.Router();
const user = require('../data/user');
const authMiddleware = require('./../middleware/auth')

router.get('/token', async function(req, res, next) {
  // Aca deberia realizar la validacion del login
  console.log(req.headers);
  const { email, name, photourl } = req.headers;
  console.log('email', email)
  if (email){
    let usuario = await user.getUsuario(email.toString());
    console.log(usuario);
    if (!usuario) {
      console.log('Creo el usuario en la base de datos')
      usuario = {_id: email, nombre: name, foto: photourl};
      await user.pushUsuario(usuario);
    }
  
    const token = await authMiddleware.generateTokenAuth(usuario);
    //   jwt.create(process.env.JWT_SECRET_KEY);
    // token.setExpiration(new Date().getTime() + 15*60*1000)
    console.log({token})
    res.send(token)
  } else {
    res.status(409).send("Email invalido");
  }

});

module.exports = router;

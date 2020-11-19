const dotenv = require('dotenv').config()
const express = require('express')
const router = express.Router()
const userData = require('../data/user')
const categoriaData = require('../data/categoria')
const authMiddleware = require('./../middleware/auth')

const CategoriasDefectoGasto = [
  'Comida',
  'Vivienda',
  'Servicios',
  'Ocio',
  'Otros',
]
const CategoriasDefectoIngreso = [
  'Sueldo',
  'Venta',
  'Servicio',
  'Renta',
  'Otros',
]

router.get('/token', async function (req, res, next) {
  try {
    const { idtoken } = req.headers
    const payload = await authMiddleware.verify(idtoken)
    console.log('email', payload.email)
    if (payload.email) {
      let usuario = await userData.getUsuario(req.db, {
        id: payload.email.toString(),
      })

      console.log(usuario)
      if (!usuario) {
        console.log('Creo el usuario en la base de datos')
        usuario = {
          _id: payload.email,
          nombre: payload.name,
          foto: payload.picture,
          moneda: '$',
          fechaRegistro: new Date(Date.now()),
        }

        await userData.pushUsuario(req.db, usuario)
        let categoriasUser = cargarCategorias(usuario)

        await categoriaData.pushCategorias(req.db, categoriasUser)
      }

      const accessToken = await authMiddleware.generateTokenAuth(usuario)
      console.log({ accessToken })
      res.json({ accessToken: accessToken })
    } else {
      res.status(409).send('Email invalido')
    }
  } catch (err) {
    res.status(401).send({ error: err.message })
  }
})

function cargarCategorias(usuario) {
  let categoriasGasto = CategoriasDefectoGasto.map((x) => {
    return {
      tipo: 'gasto',
      nombre: x,
      user: usuario._id,
    }
  })

  let categoriasIngreso = CategoriasDefectoIngreso.map((x) => {
    return {
      tipo: 'ingreso',
      nombre: x,
      user: usuario._id,
    }
  })

  let categorias = categoriasGasto.concat(categoriasIngreso)
  return categorias
}

module.exports = router

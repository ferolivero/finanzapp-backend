const express = require('express')
const router = express.Router()
const dataTarjeta = require('../data/tarjeta')
const authMiddleware = require('../middleware/auth')

// Trae todas las tarjetas
router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataTarjeta.getAllTarjetas(req.db, { user: user })
  res.json(result)
})

//Trae la tarjeta por :id
router.get('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataTarjeta.getTarjeta(req.db, {
    id: req.params.id,
    user: user,
  })
  res.json(result)
})

// Agrega una tarjeta
router.post('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const tarjeta = req.body
  tarjeta.user = user
  if (await isTarjetaValida(tarjeta)) {
    await dataTarjeta.pushTarjeta(req.db, tarjeta)
    const tarjetaPersistida = await dataTarjeta.getTarjeta(req.db, tarjeta._id)
    res.json(tarjetaPersistida)
  } else {
    res.status(500).send('Algun dato es incorrecto')
  }
})

// actualiza una tarjeta
router.put('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const tarjeta = req.body
  tarjeta.user = user
  tarjeta._id = req.params.id

  const tarjetaDb = dataTarjeta.getTarjeta(req.db, {
    id: tarjeta._id,
    user: user,
  })
  if (tarjetaDb && tarjetaDb.user === tarjeta.user) {
    if (await isTarjetaValida(tarjeta)) {
      await dataTarjeta.updateTarjeta(req.db, tarjeta)
      const result = await dataTarjeta.getTarjeta(req.db, req.params.id)
      res.json(result)
    } else {
      res.status(500).send('Algun dato es incorrecto')
    }
  } else {
    res.status(403).send('Acceso denegado')
  }
})

// Elimina una tarjeta
router.delete('/:id', async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const tarjetaId = req.params.id
  const tarjetaDb = await dataTarjeta.getTarjeta(req.db, {
    id: tarjetaId,
    user: user,
  })
  if (tarjetaDb && tarjetaDb.user === user) {
    await dataTarjeta.deleteTarjeta(req.db, { id: tarjetaId, user: user })
    res.send('Tarjeta eliminada')
  } else {
    res.status(403).send('Acceso denegado')
  }
})

async function isTarjetaValida(tarjeta) {
  if (tarjeta.nombre !== null) {
    return true
  }

  return false
}

module.exports = router

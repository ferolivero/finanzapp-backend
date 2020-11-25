var express = require('express')
var router = express.Router()
const dataMovimientos = require('../data/movimiento')
const authMiddleware = require('../middleware/auth')

router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  console.log('user', user)
  const result = await dataMovimientos.getAllMovimientosDesc(req.db, {
    user: user,
  })
  res.json(result)
})

router.get('/mes/:mes', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  console.log('user', user)
  let mes = req.params.mes
  if (isMesValid(mes)) {
    const filterMes = filterCreatorMes(mes)
    console.log(filterMes)
    const result = await dataMovimientos.getAllMovimientosDesc(req.db, {
      user: user,
      fecha: filterMes,
    })
    res.json(result)
  } else {
    res.status(500).send('Fecha inválida')
  }
})

//Trae un movimiento determinado por ID, debe chequear que sea de ese usuario
router.get('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataMovimientos.getMovimiento(req.db, {
    id: req.params.id,
    user: user,
  })
  if (result && result.user === user) {
    res.json(result)
  } else {
    res.status(403).send('Acceso denegado')
  }
})

function isMesValid(mes) {
  const dateReg = /^\d{4}([./-])\d{2}$/
  if (mes.match(dateReg)) {
    return true
  }
  return false
}

function filterCreatorMes(mes) {
  const anio = parseInt(mes.split('-')[0])
  mes = parseInt(mes.split('-')[1])
  const fechaInicial = new Date(anio, mes - 1, 1)
  const fechaCierre = new Date(anio, mes, 1)
  return { $gte: fechaInicial, $lt: fechaCierre }
}

module.exports = router

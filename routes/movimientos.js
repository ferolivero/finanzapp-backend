var express = require('express')
var router = express.Router()
const dataMovimientos = require('../data/movimiento')
const authMiddleware = require('../middleware/auth')

router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  console.log('user', user)
  const result = await dataMovimientos.getAllMovimientosDesc({ user: user })
  res.json(result)
})

router.get('/:mes', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  console.log('user', user)
  let mes = req.params.mes
  if (isMesValid(mes)) {
    const filterMes = filterCreatorMes(mes)
    console.log(filterMes)
    const result = await dataMovimientos.getAllMovimientosDesc({
      user: user,
      fecha: filterMes,
    })
    res.json(result)
  }
  res.status(500).send('Fecha inválida')
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

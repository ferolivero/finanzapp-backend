var express = require('express')
const authMiddleware = require('../middleware/auth')
const dataGastos = require('../data/gasto')
const dataIngresos = require('../data/ingreso')
const dataCategoria = require('../data/categoria')
const dataMovimientos = require('../data/movimiento')
var router = express.Router()

const meses = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
]

router.get(
  '/gasto/ultimos-seis-meses',
  authMiddleware.auth,
  async (req, res) => {
    const user = authMiddleware.getUserFromRequest(req)
    const fechaFinal = new Date(Date.now())
    const fechaInicial = cargoFecha()
    const filter = {
      user: user,
      fecha: { $gte: fechaInicial, $lt: fechaFinal },
    }
    const ultimoSeis = await dataGastos.getAllGastos(req.db, filter)
    const nombreMeses = obtengoMeses()
    const seisMeses = extraerValorPorMes(ultimoSeis, nombreMeses)
    res.json(seisMeses)
  }
)

router.get(
  '/ingreso/ultimos-seis-meses',
  authMiddleware.auth,
  async (req, res) => {
    const user = authMiddleware.getUserFromRequest(req)
    const fechaFinal = new Date(Date.now())
    const fechaInicial = cargoFecha()
    const filter = {
      user: user,
      fecha: { $gte: fechaInicial, $lt: fechaFinal },
    }
    const ultimoSeis = await dataIngresos.getAllIngresos(req.db, filter)
    const nombreMeses = obtengoMeses()
    const seisMeses = extraerValorPorMes(ultimoSeis, nombreMeses)
    res.json(seisMeses)
  }
)

function obtengoMeses() {
  const fechaFinal = new Date(Date.now())
  let fechaInicial = new Date()
  fechaInicial.setMonth(fechaFinal.getMonth() - 5)
  let ultimosSeis = []
  for (; fechaInicial <= fechaFinal; ) {
    ultimosSeis.push(meses[fechaInicial.getMonth()])
    fechaInicial.setMonth(fechaInicial.getMonth() + 1)
  }
  return ultimosSeis
}

function extraerValorPorMes(result, nombresMeses) {
  result = result.map((item) => {
    let newItem = item
    newItem.fecha = meses[new Date(item.fecha).getMonth()]
    return newItem
  })
  let valorDeCadaMes = []
  nombresMeses.forEach((mes) => {
    let sum = 0
    result
      .filter((x) => x.fecha === mes)
      .forEach((mov) => {
        sum += mov.monto
      })
    valorDeCadaMes.push(sum)
  })

  const valorCategorias = {
    labels: nombresMeses,
    datasets: [{ data: valorDeCadaMes }],
  }
  return valorCategorias
}

router.get('/gasto/:mes', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const tipo = 'gasto'
  let categorias = await dataCategoria.getAllCategorias(req.db, {
    user: user,
    tipo: tipo,
  })
  const nombresCategorias = extraerNombresCategorias(categorias)
  let mes = req.params.mes
  if (isMesValid(mes)) {
    const filtreMes = filterCreatorMes(mes)
    const result = await dataMovimientos.getAllMovimientosDesc(req.db, {
      user: user,
      fecha: filtreMes,
      tipo: tipo,
    })

    const resultadoPorCategoria = extraerValorPorCategoria(
      result,
      nombresCategorias
    )
    res.json(resultadoPorCategoria)
  } else {
    res.status(500).send('Fecha inválida')
  }
})

router.get('/ingreso/:mes', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const tipo = 'ingreso'
  let categorias = await dataCategoria.getAllCategorias(req.db, {
    user: user,
    tipo: tipo,
  })
  const nombresCategorias = extraerNombresCategorias(categorias)
  let mes = req.params.mes
  if (isMesValid(mes)) {
    const filtreMes = filterCreatorMes(mes)
    const result = await dataMovimientos.getAllMovimientosDesc(req.db, {
      user: user,
      fecha: filtreMes,
      tipo: tipo,
    })
    const resultadoPorCategoria = extraerValorPorCategoria(
      result,
      nombresCategorias
    )
    res.json(resultadoPorCategoria)
  } else {
    res.status(500).send('Fecha inválida')
  }
})

function filterCreatorMes(mes) {
  const anio = parseInt(mes.split('-')[0])
  mes = parseInt(mes.split('-')[1])
  const fechaInicial = new Date(anio, mes - 1, 1)
  const fechaCierre = new Date(anio, mes, 1)
  return { $gte: fechaInicial, $lt: fechaCierre }
}

function isMesValid(mes) {
  const dateReg = /^\d{4}([./-])\d{2}$/
  if (mes.match(dateReg)) {
    return true
  }
  return false
}

function extraerNombresCategorias(categorias) {
  let nombres = []
  categorias.forEach((element) => nombres.push(element.nombre))
  return nombres
}

function extraerValorPorCategoria(result, nombresCategorias) {
  let valorDeCadaCategoria = []
  nombresCategorias.forEach((categoria) => {
    let sum = 0
    result
      .filter((x) => x.categoria === categoria)
      .forEach((mov) => {
        sum += mov.monto
      })
    valorDeCadaCategoria.push(sum)
  })

  const valorCategorias = {
    labels: nombresCategorias,
    datasets: [{ data: valorDeCadaCategoria }],
  }
  return valorCategorias
}

function cargoFecha() {
  const fechaFinal = new Date(Date.now())
  let fechaInicial = new Date(fechaFinal.setMonth(fechaFinal.getMonth() - 5))
  return new Date(fechaInicial.setDate(1))
}

module.exports = router

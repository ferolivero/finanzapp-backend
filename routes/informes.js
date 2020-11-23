var express = require('express')
const authMiddleware = require('../middleware/auth')
const dataGastos = require('../data/gasto')
const dataIngresos = require('../data/ingreso')
const dataCategoria = require('../data/categoria')
const dataMovimientos = require('../data/movimiento')
var router = express.Router()

/* GET users listing. */
router.get('/gasto/ultimo-seis-meses', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req);
  const ultimoSeis = await dataGastos.getSeisMeses(req.db,{user: user});  
  const nombreMeses= obtengoMeses()
  const seisMeses=extraerValorPorMes(ultimoSeis,nombreMeses)
  res.json(seisMeses)
});

router.get('/ingreso/ultimo-seis-meses', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req);
  const ultimoSeis = await dataIngresos.getSeisMeses(req.db,{user: user});  
  const nombreMeses= obtengoMeses()
  const seisMeses=extraerValorPorMes(ultimoSeis,nombreMeses)
  res.json(seisMeses)
  });

function obtengoMeses(){
  const fechaFinal= new Date(Date.now())
  let fechaInicial =new Date()
  fechaInicial.setMonth(fechaFinal.getMonth() -5 )
  const meses=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  let ultimosSeis=[]
  for(;fechaInicial<=fechaFinal;){
      ultimosSeis.push(meses[fechaInicial.getMonth()])
      fechaInicial.setMonth((fechaInicial.getMonth()+1))
  }
  return ultimosSeis
}
function extraerValorPorMes(result,nombresMeses){
  let valorDeCadaMes = [];
  const fechaFinal= new Date(Date.now())
  let fechaInicial =new Date()
  fechaInicial.setMonth(fechaFinal.getMonth() -5 )
  for(;fechaInicial.getMonth()<=fechaFinal.getMonth();){
    let valor = 0
    for(j=0;j<result.length;j++){
        let fecha= result[j].fecha
        if(fechaInicial.getMonth() == fecha.getMonth()){
        valor = valor + result[j].monto;
        }
    }
    valorDeCadaMes.push(valor) 
    let newMes=fechaInicial.getMonth()+1
    fechaInicial.setMonth(newMes)
  }
  const valorMensual = {
    labels: nombresMeses,
    datasets: [{data: valorDeCadaMes}]
  }
  return valorMensual;
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

//result Tiene todos los movimientos filtro por user y por tipo
//nombresCategorias tiene todas las categorias del Usuario
function extraerValorPorCategoria(result, nombresCategorias) {
  let valorDeCadaCategoria = []
  for (i = 0; i < nombresCategorias.length; i++) {
    valor = 0
    for (j = 0; j < result.length; j++) {
      if (nombresCategorias[i] == result[j].categoria) {
        valor = valor + result[j].monto
      }
    }
    valorDeCadaCategoria.push(valor)
  }
  const valorCategorias = {
    labels: nombresCategorias,
    datasets: [{ data: valorDeCadaCategoria }],
  }
  return valorCategorias
}

module.exports = router

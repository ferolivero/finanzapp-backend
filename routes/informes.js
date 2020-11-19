var express = require('express');
const authMiddleware = require('../middleware/auth');
const dataGastos = require('../data/gasto');
const dataIngresos = require('../data/ingreso');
const dataCategoria = require('../data/categoria');
const dataMovimientos = require('../data/movimiento');
var router = express.Router();

/* GET users listing. */
router.get('/gasto/ultimo-seis-meses', authMiddleware.auth, async (req, res) => {
  
  const user = authMiddleware.getUserFromRequest(req);
  const ultimoSeis = await dataGastos.getSeisMeses({user: user});
  res.json(ultimoSeis)  

});

router.get('/ingreso/ultimo-seis-meses', authMiddleware.auth, async (req, res) => {
  
  const user = authMiddleware.getUserFromRequest(req);
  const ultimoSeis = await dataIngresos.getSeisMeses({user: user});
  res.json(ultimoSeis)
  
});

router.get('/gasto/:mes', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req);
  const tipo = "gasto";
  let categorias = await dataCategoria.getAllCategorias({user: user,tipo: tipo});
  const nombresCategorias = extraerNombresCategorias(categorias);
  let mes = req.params.mes;
    if (isMesValid(mes)) {
      const filtreMes = filterCreatorMes (mes);
      const result = await dataMovimientos.getAllMovimientosDesc({user: user, fecha: filtreMes, tipo: tipo})
 
      const resultadoPorCategoria = extraerValorPorCategoria(result,nombresCategorias);
      res.json(resultadoPorCategoria);
    }
  res.status(500).send("Fecha inválida");
});

router.get('/ingreso/:mes', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req);
  const tipo = "ingreso";
  let categorias = await dataCategoria.getAllCategorias({user: user,tipo: tipo});
  const nombresCategorias = extraerNombresCategorias(categorias);
  let mes = req.params.mes;
    if (isMesValid(mes)) {
      const filtreMes = filterCreatorMes (mes);
      const result = await dataMovimientos.getAllMovimientosDesc({user: user, fecha: filtreMes, tipo: tipo})
      const resultadoPorCategoria = extraerValorPorCategoria(result,nombresCategorias);
      res.json(resultadoPorCategoria);
    }
  res.status(500).send("Fecha inválida");
});

function filterCreatorMes (mes){
  const anio = parseInt(mes.split('-')[0]);
  mes = parseInt(mes.split('-')[1]);
  const fechaInicial = new Date(anio, mes-1, 1);
  const fechaCierre = new Date(anio, mes, 1);
  return {$gte: fechaInicial, $lt: fechaCierre};
}

function isMesValid(mes) {
  const dateReg = /^\d{4}([./-])\d{2}$/;
  if (mes.match(dateReg)){
    return true;
  }
  return false;
}

function extraerNombresCategorias(categorias){
  let nombres = [];
  categorias.forEach(element => nombres.push(element.nombre));
  return nombres;
}

//result Tiene todos los movimientos filtro por user y por tipo
//nombresCategorias tiene todas las categorias del Usuario 
function extraerValorPorCategoria(result,nombresCategorias){
  let valorDeCadaCategoria = [];
  for(i=0;i<nombresCategorias.length;i++){
    valor = 0;
    for(j=0;j<result.length;j++){
        if(nombresCategorias[i] == result[j].categoria){
        
        valor = valor + result[j].monto;
        }
    }
    valorDeCadaCategoria.push(valor);  
  }
  const valorCategorias = {
    labels: nombresCategorias,
    datasets: [{data: valorDeCadaCategoria}]
  }
  return valorCategorias;
  }


module.exports = router;

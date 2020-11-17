var express = require('express');
var router = express.Router();
const dataMovimientosRecurrentes = require('../data/movimientoRecurrente');
const dataGastosRecurrentes = require('../data/gastoRecurrente');
const dataMovimientos= require('../data/movimiento');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  console.log('user', user)
  const result = await dataMovimientosRecurrentes.getAllMovimientosDesc({ user: user })
  res.json(result)
})

router.get('/generar', /*authMiddleware.auth,*/ async (req, res) => {
  //const user = authMiddleware.getUserFromRequest(req)
  const movsRecurrentes = await dataMovimientosRecurrentes.getAllMovimientosDesc()
  let nuevosMovs = movsRecurrentes.map(mov => {
    let movNuevo = {
      tipo: mov.tipo,
      user: mov.user,
      monto: mov.monto,
      fecha: new Date(),
      descripcion: mov.descripcion,
      categoria: mov.categoria,
      idRecurrente: mov._id.toString(),
    }
    if (mov.tipo === 'gasto'){
      movNuevo.fechaImputacion = new Date()
      movNuevo.tipoPago = mov.tipoPago
      if (mov.cuotas !== undefined) {
        movNuevo.monto = mov.monto / mov.cuotas
        movNuevo.cuotaNum = mov.cuotas - mov.cuotasRestantes + 1
        movNuevo.cuotaCant = mov.cuotas
      }
    }
    return movNuevo
  });
  dataGastosRecurrentes.updateCuota();
  const result = await dataMovimientos.imputarRecurrentes(nuevosMovs)
  res.json(result)
})

module.exports = router

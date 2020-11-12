var express = require('express')
var router = express.Router()
const dataGastosRecurrentes = require('../data/gastoRecurrente')
const dataGastos = require('../data/gasto')
const dataCategorias = require('../data/categoria')
const authMiddleware = require('../middleware/auth')
const myType = 'gasto'

router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataGastosRecurrentes.getAllGastos({ user: user })
  res.json(result)
})

router.get('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataGastosRecurrentes.getGasto({
    id: req.params.id,
    user: user,
  })
  res.json(result)
})

router.post('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const gasto = req.body
  gasto.user = user
  gasto.tipo = myType

  if (await isGastoValido(gasto)) {
    if (gasto.cuotas !== undefined) {
      gasto.cuotasRestantes = gasto.cuotas - 1
    }
    await dataGastosRecurrentes.pushGasto(gasto)
    const gastoPersistido = await dataGastosRecurrentes.getGasto({
      id: gasto._id,
    })
    let gasto1 = {
      tipo: myType,
      user: user,
      monto: gasto.monto,
      fecha: gasto.fecha,
      fechaImputacion: gasto.fecha,
      descripcion: gasto.descripcion,
      categoria: gasto.categoria,
      tipoPago: gasto.tipoPago,
      idRecurrente: gasto._id.toString(),
    }
    if (gasto.cuotas !== undefined) {
      gasto1.monto = gasto.monto/gasto.cuotas
      gasto1.cuotaNum = 1
      gasto1.cuotaCant = gasto.cuotas
    }
    dataGastos.pushGasto(gasto1)
    res.json(gastoPersistido)
  } else {
    res.status(500).send('Algún dato es incorrecto')
  }
})

// router.put('/:id', authMiddleware.auth, async (req, res) => {
//   const user = authMiddleware.getUserFromRequest(req)
//   const gasto = req.body
//   gasto.user = user
//   gasto.tipo = myType
//   gasto._id = req.params.id

//   const gastoDb = await dataGastosRecurrentes.getGasto({
//     id: gasto._id,
//     user: user,
//   })
//   if (gastoDb && gastoDb.user === gasto.user) {
//     const isValid = await isGastoValido(gasto)
//     if (isValid) {
//       await dataGastosRecurrentes.updateGasto(gasto)
//       res.json(
//         await dataGastosRecurrentes.getGasto({ id: gasto._id, user: user })
//       )
//     } else {
//       res.status(500).send('Algún dato es incorrecto')
//     }
//   } else {
//     res.status(403).send('Acceso denegado')
//   }
// })

router.delete('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const gastoId = req.params.id
  const gastoDb = await dataGastosRecurrentes.getGasto({
    id: gastoId,
    user: user,
  })
  if (gastoDb && gastoDb.user === user) {
    await dataGastosRecurrentes.deleteGasto({ id: gastoId, user: user })
    await dataGastos.deleteGastos({ user: user, idRecurrente: gastoId })
    res.send('Gasto y todas sus cuotas eliminadas')
  } else {
    res.status(403).send('Acceso denegado')
  }
})

async function isGastoValido(gasto) {
  if (
    gasto.monto > 0 &&
    (await dataCategorias
      .getAllCategorias({ user: gasto.user, tipo: gasto.tipo })
      .then((categorias) => {
        return categorias.find((x) => x.nombre === gasto.categoria)
      })) &&
    ((gasto.tipoPago === 'Tarjeta' &&
      ((gasto.cuotas !== undefined && gasto.cuotas > 0) ||
        gasto.cuotas === undefined)) ||
      gasto.tipoPago === 'Contado')
  ) {
    return true
  } else {
    return false
  }
}

module.exports = router

var express = require('express')
var router = express.Router()
const dataGastosRecurrentes = require('../data/gastoRecurrente')
const dataGastos = require('../data/gasto')
const dataCategorias = require('../data/categoria')
const authMiddleware = require('../middleware/auth')
const myType = 'gasto'

router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataGastosRecurrentes.getAllGastos(req.db, {
    user: user,
  })
  res.json(result)
})

router.get('/no-cuotas', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataGastosRecurrentes.getAllGastos(req.db, {
    user: user,
    cuotas: { $exists: false },
  })
  res.json(result)
})

router.get('/cuotas', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  let filter = { user: user, cuotas: { $exists: true } }
  if (req.query.soloPendientes === true) {
    filter.cuotasRestantes = { $gt: 0 }
  }
  const result = await dataGastosRecurrentes.getAllGastos(req.db, filter)
  res.json(result)
})

router.get('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataGastosRecurrentes.getGasto(req.db, {
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

  if (await isGastoValido(req.db, gasto)) {
    if (gasto.cuotas !== undefined) {
      gasto.cuotasRestantes = gasto.cuotas - 1
    }
    const result = await dataGastosRecurrentes.pushGasto(req.db, gasto)
    const gastoPersistido = await dataGastosRecurrentes.getGasto(req.db, {
      id: result.insertedId,
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
      gasto1.monto = gasto.monto / gasto.cuotas
      gasto1.cuotaNum = 1
      gasto1.cuotaCant = gasto.cuotas
    }
    dataGastos.pushGasto(req.db, gasto1)
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
  const gastoDb = await dataGastosRecurrentes.getGasto(req.db, {
    id: gastoId,
    user: user,
  })
  if (gastoDb && gastoDb.user === user) {
    await dataGastosRecurrentes.deleteGasto(req.db, { id: gastoId, user: user })
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
      .getAllCategorias(req.db, { user: gasto.user, tipo: gasto.tipo })
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

var express = require('express')
var router = express.Router()
const dataMovimientosRecurrentes = require('../data/movimientoRecurrente')
const dataGastos = require('../data/gasto')
const dataCategorias = require('../data/categoria')
const authMiddleware = require('../middleware/auth')
const myType = 'gasto'

router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataMovimientosRecurrentes.getAllGastos(req.db, {
    user: user,
  })

  res.json(result)
})

router.get('/no-cuotas', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataMovimientosRecurrentes.getAllGastos(req.db, {
    user: user,
    cuotas: { $exists: false },
  })
  res.json(result)
})

router.get('/cuotas', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  let filter = { user: user, cuotas: { $exists: true } }
  const result = await dataMovimientosRecurrentes.getAllGastos(req.db, filter)
  res.json(result)
})

router.get('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataMovimientosRecurrentes.getGasto(req.db, {
    id: req.params.id,
    user: user,
  })

  if (result && result.user === user) {
    res.json(result)
  } else {
    res.status(403).send('Acceso denegado')
  }
})

router.post('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const gasto = req.body
  gasto.user = user
  gasto.tipo = myType

  if (await isGastoValido(req.db, gasto)) {
    if (gasto.cuotas !== undefined) {
      gasto.cuotasRestantes = gasto.cuotas
    }
    const result = await dataMovimientosRecurrentes.pushGasto(req.db, gasto)

    const gastoPersistido = await dataMovimientosRecurrentes.getGasto(req.db, {
      id: result.insertedId,
    })
    res.json(gastoPersistido)
  } else {
    res.status(500).send('Algún dato es incorrecto')
  }
})

router.put('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const gasto = req.body
  gasto.user = user
  gasto.tipo = myType
  gasto._id = req.params.id

  console.log({ user })
  console.log({ gasto })
  const gastoDb = await dataMovimientosRecurrentes.getGasto(req.db, {
    id: gasto._id,
    user: user,
  })

  console.log({ gastoDb })
  if (gastoDb && gastoDb.user === gasto.user) {
    const isValid = await isGastoValido(req.db, gasto)
    if (isValid) {
      await dataMovimientosRecurrentes.updateGastoRecurrente(req.db, gasto)
      res.json(
        await dataMovimientosRecurrentes.getGasto(req.db, {
          id: gasto._id,
          user: user,
        })
      )
    } else {
      res.status(500).send('Algún dato es incorrecto')
    }
  } else {
    res.status(403).send('Acceso denegado')
  }
})

router.delete('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const gastoId = req.params.id
  console.log('GastoId', gastoId)
  const gastoDb = await dataMovimientosRecurrentes.getGasto(req.db, {
    id: gastoId,
    user: user,
  })
  if (gastoDb && gastoDb.user === user) {
    const result = await dataMovimientosRecurrentes.deleteGasto(req.db, {
      id: gastoId,
      user: user,
    })
    console.log('DeleteGastoRecurrente', result)
    if (gastoDb.cuotas !== undefined && result) {
      await dataGastos.deleteGastos(req.db, {
        user: user,
        idRecurrente: gastoId,
      })
      res.send('Gasto y todas sus cuotas eliminadas')
    } else {
      res.send('Gasto recurrente eliminado')
    }
  } else {
    res.status(403).send('Acceso denegado')
  }
})

async function isGastoValido(connection, gasto) {
  const isCategoriaValid = await dataCategorias
    .getAllCategorias(connection, { user: gasto.user, tipo: gasto.tipo })
    .then((categorias) => {
      return categorias.find((x) => x.nombre === gasto.categoria)
    })

  if (
    gasto.monto > 0 &&
    isCategoriaValid &&
    (isPagoContadoValid(gasto) || isPagoTarjetaValid(gasto))
  ) {
    return true
  } else {
    return false
  }
}

function isPagoContadoValid(gasto) {
  return gasto.tipoPago === 'Contado' && !gasto.cuotas
}

function isPagoTarjetaValid(gasto) {
  return gasto.tipoPago === 'Tarjeta' && (!gasto.cuotas || gasto.cuotas > 0)
}

module.exports = router

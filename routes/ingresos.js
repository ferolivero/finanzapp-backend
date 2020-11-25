var express = require('express')
var router = express.Router()
const dataIngresos = require('../data/ingreso')
const dataCategorias = require('../data/categoria')
const authMiddleware = require('../middleware/auth')
const myType = 'ingreso'

router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataIngresos.getAllIngresos(req.db, { user: user })
  res.json(result)
})

router.get('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataIngresos.getIngreso(req.db, {
    id: req.params.id,
    user: user,
  })
  res.json(result)
})

router.post('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const ingreso = req.body
  ingreso.user = user
  ingreso.tipo = myType

  if (await isIngresoValido(req.db, ingreso)) {
    const result = await dataIngresos.pushIngreso(
      req.db,
      ingresoLimpio(ingreso)
    )
    const ingresoPersistido = await dataIngresos.getIngreso(req.db, {
      id: result.insertedId,
    })
    res.json(ingresoPersistido)
  } else {
    res.status(500).send('Algún dato es incorrecto')
  }
})

router.put('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const ingreso = req.body
  ingreso.user = user
  ingreso.tipo = myType
  ingreso._id = req.params.id

  const ingresoDb = await dataIngresos.getIngreso(req.db, {
    id: ingreso._id,
    user: user,
  })
  if (ingresoDb && ingresoDb.user === ingreso.user) {
    const isValid = await isIngresoValido(req.db, ingreso)
    if (isValid) {
      await dataIngresos.updateIngreso(req.db, ingreso)
      const result = await dataIngresos.getIngreso(req.db, {
        id: ingreso._id,
        user: user,
      })
      res.json(result)
    } else {
      res.status(500).send('Algún dato es incorrecto')
    }
  } else {
    res.status(403).send('Acceso denegado')
  }
})

router.delete('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const ingresoId = req.params.id
  const ingresoDb = await dataIngresos.getIngreso(req.db, {
    id: ingresoId,
    user: user,
  })
  if (ingresoDb && ingresoDb.user === user) {
    await dataIngresos.deleteIngreso(req.db, { id: ingresoId, user: user })
    res.send('Ingreso eliminado')
  } else {
    res.status(403).send('Acceso denegado')
  }
})

async function isIngresoValido(connection, ingreso) {
  if (
    ingreso.monto > 0 &&
    (await dataCategorias
      .getAllCategorias(connection, { user: ingreso.user, tipo: ingreso.tipo })
      .then((categorias) => {
        return categorias.find((x) => x.nombre === ingreso.categoria)
      }))
  ) {
    return true
  } else {
    return false
  }
}

function ingresoLimpio(ingreso) {
  return {
    user: ingreso.user,
    tipo: ingreso.tipo,
    monto: ingreso.monto,
    fecha: ingreso.fecha || new Date(),
    descripcion: ingreso.descripcion || '',
    categoria: ingreso.categoria,
  }
}

module.exports = router

var express = require('express')
var router = express.Router()
const dataIngresos = require('../data/ingreso')
const dataCategorias = require('../data/categoria')
const authMiddleware = require('../middleware/auth')
const myType = 'ingreso'

router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataIngresos.getAllIngresos({ user: user })
  res.json(result)
})

router.get('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataIngresos.getIngreso({
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

  if (await isIngresoValido(ingreso)) {
    const result = await dataIngresos.pushIngreso(ingresoLimpio(ingreso))
    const ingresoPersistido = await dataIngresos.getIngreso({
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

  const ingresoDb = await dataIngresos.getIngreso({
    id: ingreso._id,
    user: user,
  })
  if (ingresoDb && ingresoDb.user === ingreso.user) {
    const isValid = await isIngresoValido(ingreso)
    if (isValid) {
      await dataIngresos.updateIngreso(ingreso)
      const result = await dataIngresos.getIngreso({
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
  const ingresoDb = await dataIngresos.getIngreso({ id: ingresoId, user: user })
  if (ingresoDb && ingresoDb.user === user) {
    await dataIngresos.deleteIngreso()
    res.send('Ingreso eliminado')
  } else {
    res.status(403).send('Acceso denegado')
  }
})

async function isIngresoValido(ingreso) {
  if (
    ingreso.monto > 0 &&
    (await dataCategorias
      .getAllCategorias({ user: ingreso.user, tipo: ingreso.tipo })
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
    fecha: ingreso.fecha,
    descripcion: ingreso.descripcion || '',
    categoria: ingreso.categoria,
  }
}

module.exports = router

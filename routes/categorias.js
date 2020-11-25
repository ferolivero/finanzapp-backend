const express = require('express')
const router = express.Router()
const dataCategoria = require('../data/categoria')
const authMiddleware = require('../middleware/auth')

async function isTipoValido(tipo) {
  if (tipo === 'gasto' || tipo === 'ingreso') {
    return true
  }
  return false
}

router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await dataCategoria.getAllCategorias(req.db, { user: user })
  res.json(result)
})

router.get('/:tipo/', authMiddleware.auth, async (req, res) => {
  const tipo = req.params.tipo
  if (await isTipoValido(tipo)) {
    const user = authMiddleware.getUserFromRequest(req)
    const result = await dataCategoria.getAllCategorias(req.db, {
      user: user,
      tipo: tipo,
    })
    res.json(result)
  } else {
    res.status(500).send('Tipo de categoria invalida')
  }
})

//Trae la categoria por :id
router.get('/:tipo/:id', authMiddleware.auth, async (req, res) => {
  const tipo = req.params.tipo
  if (await isTipoValido(tipo)) {
    const user = authMiddleware.getUserFromRequest(req)
    const result = await dataCategoria.getCategoria(req.db, {
      id: req.params.id,
      user: user,
      tipo: tipo,
    })
    if (result && result.user === user) {
      res.json(result)
    } else {
      res.status(403).send('Acceso denegado')
    }
  } else {
    res.status(500).send('Tipo de categoria invalida')
  }
})

// Agrega una categoria
router.post('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const filter = {
    user: user,
    tipo: req.body.tipo,
    nombre: req.body.nombre,
  }
  const result = await dataCategoria.pushCategoria(req.db, filter)

  const categoriaPersistida = await dataCategoria.getCategoria(req.db, {
    id: result.insertedId,
  })
  res.json(categoriaPersistida)
})

// actualiza una categoria
router.put('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const idCategoria = req.params.id
  console.log({ idCategoria })
  const categoriaDb = await dataCategoria.getCategoria(req.db, {
    id: idCategoria,
    user: user,
  })

  console.log({ categoriaDb })

  if (categoriaDb && categoriaDb.user === user) {
    const filter = {
      id: req.params.id,
      tipo: req.body.tipo,
      nombre: req.body.nombre,
      user: user,
    }

    console.log({ filter })

    await dataCategoria.updateCategoria(req.db, filter)
    const result = await dataCategoria.getCategoria(req.db, {
      id: idCategoria,
    })
    res.json(result)
  } else {
    res.status(403).send('Acceso denegado')
  }
})

// Elimina una categoria
router.delete('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const idCategoria = req.params.id
  const categoriaDb = await dataCategoria.getCategoria(req.db, {
    id: idCategoria,
  })
  if (categoriaDb && categoriaDb.user === user) {
    await dataCategoria.deleteCategoria(req.db, { id: idCategoria, user: user })
    res.status(200).send('Categoria eliminada')
  } else {
    res.status(403).send('Acceso denegado')
  }
})

module.exports = router

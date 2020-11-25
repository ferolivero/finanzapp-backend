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
    res.json(result)
  } else {
    res.status(500).send('Tipo de categoria invalida')
  }
})

// Agrega una categoria
router.post('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req) 
  const categoria = {
    user: user,
    tipo : req.body.tipo,
    nombre : req.body.nombre
  }
  console.log(categoria)
  await dataCategoria.pushCategoria(req.db, categoria)

  const categoriaPersistida = await dataCategoria.getCategoria(
    req.db,
    categoria._id
  )
  res.json(categoriaPersistida)
})

// actualiza una categoria
router.put('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const idCategoria = {
    id :req.params.id
  }
  const categoriaDb = await dataCategoria.getCategoria(req.db, idCategoria)
  
  if (categoriaDb && categoriaDb.user === user) {
    const categoria = {
      id : req.params.id,
      tipo : req.body.tipo,
      nombre : req.body.nombre,
      user : user,
    }
    console.log(categoria)
    await dataCategoria.updateCategoria(req.db, categoria)
    const result = await dataCategoria.getCategoria(req.db, idCategoria)
    res.json(result)
  } else {
    res.status(403).send('Acceso denegado')
  }
})

// Elimina una categoria
router.delete('/:id', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const idCategoria = req.params.id
  const categoriaDb = await dataCategoria.getCategoria(req.db, idCategoria)
  if (categoriaDb && categoriaDb.user === user) {
    await dataCategoria.deleteCategoria(req.db, { id: idCategoria, user: user })
    res.status(200).send('Categoria eliminada')
  } else {
    res.status(403).send('Acceso denegado')
  }
})

module.exports = router

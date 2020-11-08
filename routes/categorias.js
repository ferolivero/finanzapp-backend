const express = require('express');
const router = express.Router();
const dataCategoria = require('../data/categoria'); 
const authMiddleware = require('../middleware/auth');

async function isTipoValido(tipo){
  if (tipo==="gasto" || tipo ==="ingreso"){
    return true;
  } 
  return false;
}

router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req);
  const result = await dataCategoria.getAllCategorias({user: user});
  res.json(result);
});

router.get('/:tipo/', authMiddleware.auth, async (req, res) => {
  const tipo = req.params.tipo;
  if (await isTipoValido(tipo)){
    const user = authMiddleware.getUserFromRequest(req);
    const result = await dataCategoria.getAllCategorias({user: user, tipo: tipo});
    res.json(result);
  } else {
    res.status(500).send("Tipo de categoria invalida");
  }
});

//Trae la categoria por :id
router.get('/:tipo/:id', authMiddleware.auth, async (req, res) =>{
  const tipo = req.params.tipo;
  if (await isTipoValido(tipo)){
    const user = authMiddleware.getUserFromRequest(req);
    const result = await dataCategoria.getCategoria({id: id, user: user, tipo: tipo});
    res.json(result);
  } else {
    res.status(500).send("Tipo de categoria invalida");
  }
});

// Agrega una categoria
router.post('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req);
  const categoria = req.body;
  categoria.user = user;
  await dataCategoria.pushCategoria(categoria)
  const categoriaPersistida = await dataCategoria.getCategoria(categoria._id)
  res.json(categoriaPersistida);
});

// actualiza una categoria
router.put('/:id', authMiddleware.auth, async (req, res) =>{
  const user = authMiddleware.getUserFromRequest(req);
  const idCategoria = req.params.id;
  const categoriaDb = await dataCategoria.getCategoria(idCategoria)
  if (categoriaDb && categoriaDb.user === user) {
    const categoria = req.body
    categoria._id = idCategoria
    await dataCategoria.updateCategoria(categoria)
    const result = await dataCategoria.getCategoria(idCategoria);
    res.json(result);
  } else {
    res.status(403).send("Acceso denegado");
  }
});

// Elimina una categoria
router.delete('/:id', authMiddleware.auth, async (req,res) => {
  const user = authMiddleware.getUserFromRequest(req);
  const idCategoria = req.params.id;
  const categoriaDb = await dataCategoria.getCategoria(idCategoria)
  if (categoriaDb && categoriaDb.user === user) { 
    await dataCategoria.deleteCategoria({id: idCategoria, user: user});
    res.status(200).send('Categoria eliminada');
  } else {
    res.status(403).send("Acceso denegado");
  }
});

module.exports = router;
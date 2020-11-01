const express = require('express');
const router = express.Router();
const dataCategoria = require('../data/categoria'); 
const authMiddleware = require('../middleware/auth');

// Trae todas las categorias, validacion de prueba
/*router.get('/', async (req, res) => {
  const tipoCategoria= req.body.tipo;
  if ((tipoCategoria == cat1) || (tipoCategoria==cat2)){
    res.json( await dataCategoria.getAllCategorias(tipoCategoria));
  }
  else{
    res.send('categoria invalida');
  }  
});
*/

// Trae todas las categorias
router.get('/', authMiddleware.auth, async (req, res) => {
  res.json( await dataCategoria.getAllCategorias());
});

router.get('/:tipo', authMiddleware.auth, async (req, res) => {
  const tipos = ['gasto', 'ingreso'];
  if (tipos.includes(req.params.tipo)){
    res.json( await dataCategoria.getAllCategorias(req.params.tipo));
  } else {
    res.status(404).send("Categoria inválida");
  }
});

//Trae la categoria por :id
router.get('/:id', authMiddleware.auth, async (req, res) =>{
  await dataCategoria.getCategoria(req.body.tipo, req.params.id);
  res.json(categoria)
});


/*
// Agrega una categoria
router.post('/', async (req, res) => {
  const categoria= req.body
  await dataCategoria.pushCategoria(categoria)
  const categoriaPersistida = await dataCategoria.getCategoria(categoria._id)
  res.json(categoriaPersistida);
});

// actualiza una categoria
router.put('/:id', async (req, res) =>{
  const categoria= req.body
  categoria._id= req.params.id
  await dataCategoria.updateCategoria(categoria)
  res.json(await dataCategoria.getCategoria(req.params.id));
});

// Elimina una categoria
router.delete('/:id', async (req,res) => {
  await dataCategoria.deleteCategoria(req.params.id);
  res.send('categoria eliminada');
});
*/
module.exports = router;
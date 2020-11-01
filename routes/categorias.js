const express = require('express');
const router = express.Router();
const dataCategoria = require('../data/categoria'); 
const authMiddleware = require('../middleware/auth');


async function tipoValido(tipo){
  if (tipo==="gasto" || tipo ==="ingreso"){
    return true;
  } 
  else {
    return false;
  }
}
// Trae todas las categorias
router.get('/:tipo/', authMiddleware.auth, async (req, res) => {
  if (await tipoValido(req.params.tipo)){
    if(req.params.tipo === "ingreso"){
      res.json( await dataCategoria.getAllCategorias("categoriasIngresos"));
    }
    if(req.params.tipo === "gasto"){
      res.json( await dataCategoria.getAllCategorias("categoriasGastos"));
    }
  }else{
    res.status(500).send("Tipo de categoria invalida");
  }
});

//Trae la categoria por :id
router.get('/:tipo/:id', authMiddleware.auth, async (req, res) =>{
   if (await tipoValido(req.params.tipo)){
    if(req.params.tipo === "ingreso"){
      res.json( await dataCategoria.getCategoria("categoriasIngresos", req.params.id));
    }
    if(req.params.tipo === "gasto"){
      res.json( await dataCategoria.getCategoria("categoriasGastos", req.params.id));
    }
  }else{
    res.status(500).send("Tipo de categoria invalida");
  }
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
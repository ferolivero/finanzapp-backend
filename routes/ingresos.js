var express = require('express');
var router = express.Router();
const dataIngresos = require('../data/ingreso');


router.get('/', async (req, res, next) =>{
  res.json( await dataIngresos.getAllingresos(req.query.idUsuario));
});


router.get('/:id', async (req, res) =>{
      res.json(await dataIngresos.getingreso(req.params.id));
});

router.post('/', async (req, res) => {
  const ingreso = req.body;
  await dataIngresos.pushingreso(ingreso);
  const ingresoPersistido = await dataIngresos.getingreso(ingreso._id); 
  res.json(ingresoPersistido);
});

router.put('/:id', async (req, res) =>{
  const ingreso = req.body;
  ingreso._id = req.params.id;
  await dataIngresos.updateingreso(ingreso);

  res.json(await dataIngresos.getingreso(req.params.id))
});

router.delete('/:id', async (req,res) => {
  await dataIngresos.deleteingreso(req.params.id);
  res.send('ingreso eliminado');
});

module.exports = router;

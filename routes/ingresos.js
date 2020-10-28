var express = require('express');
var router = express.Router();
const dataIngresos = require('../data/ingreso');
const dataUsers = require('../data/user');


//Me falta validar que exista la categoria
async function ingresoValido(ingreso){
  if (await dataUsers.getUser(ingreso.idUsuario) !== null &&
      ingreso.monto > 0){
    return true;
  } else {
    return false;
  }
}

router.get('/', async (req, res, next) =>{
  res.json( await dataIngresos.getAllIngresos());
});


router.get('/:id', async (req, res) =>{
      res.json(await dataIngresos.getingreso(req.params.id));
});

router.post('/', async (req, res) => {
  const ingreso = req.body;
  //Me falta validar que exista la categoria
  if (await ingresoValido(ingreso)){
    await dataIngresos.pushingreso(ingreso);
    const ingresoPersistido = await dataIngresos.getingreso(ingreso._id); 
    res.json(ingresoPersistido);
  } else {
    res.status(500).send("Algún dato es incorrecto");
  }
});

router.put('/:id', async (req, res) =>{
  const ingreso = req.body;
  //Me falta validar que exista la categoria
  if (await ingresoValido(ingreso)){
    ingreso._id = req.params.id;
    await dataIngresos.updateingreso(ingreso);
    res.json(await dataIngresos.getingreso(req.params.id))
  } else {
    res.status(500).send("Algún dato es incorrecto");
  }
});

router.delete('/:id', async (req,res) => {
  await dataIngresos.deleteingreso(req.params.id);
  res.send('ingreso eliminado');
});

module.exports = router;

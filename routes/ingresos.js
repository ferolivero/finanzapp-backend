var express = require('express');
var router = express.Router();
const dataIngresos = require('../data/ingreso');


/* Trae todos los ingresos del usuario */
router.get('/', async (req, res, next) => {
  res.json( await dataIngresos.getAllIngresos());
});

//Trae un ingreso determinado por ID, debe chequear que sea de ese usuario
router.get('/:id', async (req, res) =>{
  res.send('respond with a resource');});

// Agrega un ingreso
router.post('/', async (req, res) => {
  res.send('respond with a resource');
});

// Edita un ingreso
router.put('/:id', async (req, res) =>{
  res.send('respond with a resource');
});

// Elimina un ingreso
router.delete('/:id', async (req,res) => {
  res.send('respond with a resource');
});

module.exports = router;

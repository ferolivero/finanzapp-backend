var express = require('express');
var router = express.Router();
const dataGastos = require('../data/gasto');


/* Trae todos los gastos del usuario */
router.get('/', async (req, res, next) =>{
  res.json( await dataGastos.getAllGastos());
});

//Trae un gasto determinado por ID, debe chequear que sea de ese usuario
router.get('/:id', async (req, res) =>{
  res.send('respond with a resource');});

// Agrega un gasto
router.post('/', async (req, res) => {
  res.send('respond with a resource');
});

// Edita un gasto
router.put('/:id', async (req, res) =>{
  res.send('respond with a resource');
});

// Elimina un gasto
router.delete('/:id', async (req,res) => {
  res.send('respond with a resource');
});

module.exports = router;

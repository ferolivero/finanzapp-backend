var express = require('express');
var router = express.Router();

/* Trae todos los ingresos del usuario */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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

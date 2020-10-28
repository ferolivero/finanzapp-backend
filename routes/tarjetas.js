const express = require('express');
const router = express.Router();
const dataTarjeta = require('../data/tarjeta'); 

// Trae todas las tarjetas
router.get('/', async (req, res) => {
  res.json( await dataTarjeta.getAllTarjetas() );
});

//Trae la tarjeta por :id
router.get('/:id', async (req, res) =>{
  await dataTarjeta.getTarjeta(req.params.id);
  res.json(tarjeta)
});

// Agrega una tarjeta
router.post('/', async (req, res) => {
  const tarjeta= req.body
  await dataTarjeta.pushTarjeta(tarjeta)
  const tarjetaPersistida = await dataTarjeta.getTarjeta(tarjeta._id)
  res.json(tarjetaPersistida);
});

// actualiza una tarjeta
router.put('/:id', async (req, res) =>{
  const tarjeta= req.body
  tarjeta._id= req.params.id
  await dataTarjeta.updateTarjeta(tarjeta)
  res.json(await dataTarjeta.getTarjeta(req.params.id));
});

// Elimina una tarjeta
router.delete('/:id', async (req,res) => {
  await dataTarjeta.deleteTarjeta(req.params.id);
  res.send('tarjeta eliminada');
});

module.exports = router;
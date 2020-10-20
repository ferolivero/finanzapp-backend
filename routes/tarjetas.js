const express = require('express');
const router = express.Router();
const dataTarjetas = require('./../data/tarjetas'); 

// Trae todas las tarjetas
router.get('/', async (req, res) => {
  res.json();
});

//Trae la tarjeta por :id
router.get('/:id', async (req, res) =>{
  res.json();
});

// Agrega una tarjeta
router.post('/', async (req, res) => {
  res.json();
});

// actualiza una tarjeta
router.put('/:id', async (req, res) =>{
  res.json();
});

// Elimina una tarjeta
router.delete('/:id', async (req,res) => {
  res.send('tarjeta eliminada');
});

module.exports = router;

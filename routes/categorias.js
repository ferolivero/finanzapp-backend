const express = require('express');
const router = express.Router();
const dataCategoria = require('./../data/categoria'); 

// Trae todas las categorias
router.get('/', async (req, res) => {
  res.json();
});

//Trae la categoria por :id
router.get('/:id', async (req, res) =>{
  res.json();
});

// Agrega una categoria
router.post('/', async (req, res) => {
  res.json();
});

// actualiza una categoria
router.put('/:id', async (req, res) =>{
  res.json();
});

// Elimina una categoria
router.delete('/:id', async (req,res) => {
  res.send('categoria eliminada');
});

module.exports = router;

var express = require('express');
var router = express.Router();
const dataGastos = require('../data/gasto');


/* Trae todos los gastos del usuario */
router.get('/', async (req, res, next) =>{
  res.json( await dataGastos.getAllGastos(req.query.idUsuario));
});


//Trae un gasto determinado por ID, debe chequear que sea de ese usuario
router.get('/:id', async (req, res) =>{
      res.json(await dataGastos.getGasto(req.params.id));
});

// Agrega un gasto
router.post('/', async (req, res) => {
  const gasto = req.body;
  await dataGastos.pushGasto(gasto);
  const gastoPersistido = await dataGastos.getGasto(gasto._id); 
  res.json(gastoPersistido);
});

// Edita un gasto
router.put('/:id', async (req, res) =>{
  const gasto = req.body;
  gasto._id = req.params.id;
  await dataGastos.updateGasto(gasto);

  res.json(await dataGastos.getGasto(req.params.id))
});

// Elimina un gasto
router.delete('/:id', async (req,res) => {
  await dataGastos.deleteGasto(req.params.id);
  res.send('Gasto eliminado');
});

module.exports = router;

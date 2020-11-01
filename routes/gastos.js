var express = require('express');
var router = express.Router();
const dataGastos = require('../data/gasto');
const dataUsers = require('../data/user');
const dataCategorias = require('../data/categoria');
const authMiddleware = require('../middleware/auth');

async function gastoValido(gasto){
  const tiposPago = ['Tarjeta', 'Contado'];
  const myType = 'gasto';
  if (gasto.tipo === myType &&
      await dataUsers.getUsuario(gasto.idUsuario) !== null && 
      gasto.monto > 0 && 
      tiposPago.includes(gasto.tipoPago) &&
      await dataCategorias.getAllCategorias(myType).then(data => {return data.find(x => x.nombre === gasto.categoria)}))
  {
    return true;
  } else {
    return false;
  }
}

/* Trae todos los gastos del usuario */
router.get('/', authMiddleware.auth, async (req, res, next) =>{
  res.json( await dataGastos.getAllGastos());
});

//Trae un gasto determinado por ID, debe chequear que sea de ese usuario
router.get('/:id', authMiddleware.auth, async (req, res) =>{
      res.json(await dataGastos.getGasto(req.params.id));
});

// Agrega un gasto
router.post('/', authMiddleware.auth, async (req, res) => {
  const gasto = req.body;
  if (await gastoValido(gasto)){
    await dataGastos.pushGasto(gasto);
    const gastoPersistido = await dataGastos.getGasto(gasto._id); 
    res.json(gastoPersistido);
  } else {
    res.status(500).send("Algún dato es incorrecto");
  }
});

// Edita un gasto
router.put('/:id', authMiddleware.auth, async (req, res) =>{
  const gasto = req.body;
    if (await gastoValido(gasto)){
      gasto._id = req.params.id;
    await dataGastos.updateGasto(gasto);
    res.json(await dataGastos.getGasto(req.params.id))
  } else {
    res.status(500).send("Algún dato es incorrecto");
  }
});

// Elimina un gasto
router.delete('/:id', authMiddleware.auth, async (req,res) => {
  await dataGastos.deleteGasto(req.params.id);
  res.send('Gasto eliminado');
});

module.exports = router;

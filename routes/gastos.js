var express = require('express');
var router = express.Router();
const dataGastos = require('../data/gasto');
const dataUsers = require('../data/user');
const authMiddleware = require('../middleware/auth');

const tiposPago = ['Tarjeta', 'Contado'];
//Me falta validar que exista la categoria
async function gastoValido(gasto){
  if (await dataUsers.getUser(gasto.idUsuario) !== null && 
      gasto.monto > 0 && 
      tiposPago.includes(gasto.tiposPago)){
    return true;
  } else {
    return false;
  }
}

/* Trae todos los gastos del usuario */
router.get('/', authMiddleware.auth, async (req, res, next) =>{
  res.json( await dataGastos.getAllGastos(authMiddleware.getUserFromRequest(req)));
});

//Trae un gasto determinado por ID, debe chequear que sea de ese usuario
router.get('/:id', authMiddleware.auth, async (req, res) =>{
      res.json(await dataGastos.getGasto(req.params.id));
});
router.get('/user/:id', authMiddleware.auth, async (req, res) =>{
  res.json(await dataUsers.getUser(req.params.id));
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
    //Me falta validar que exista la categoria
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

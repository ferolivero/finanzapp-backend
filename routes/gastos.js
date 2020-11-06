var express = require('express');
var router = express.Router();
const dataGastos = require('../data/gasto');
const dataCategorias = require('../data/categoria');
const authMiddleware = require('../middleware/auth');
const myType = 'gasto';

/* Trae todos los gastos del usuario */
router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req);
  const result = await dataGastos.getAllGastos({user: user});
  res.json(result);
});

//Trae un gasto determinado por ID, debe chequear que sea de ese usuario
router.get('/:id', authMiddleware.auth, async (req, res) =>{
  const user = authMiddleware.getUserFromRequest(req);
  const result = await dataGastos.getGasto({id: req.params.id, user: user});
  res.json(result);
});

// Agrega un gasto
router.post('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req);
  const gasto = req.body;
  gasto.user = user;
  gasto.tipo = myType;
  
  if (await isGastoValido(gasto)){
    await dataGastos.pushGasto(gasto);
    const gastoPersistido = await dataGastos.getGasto({id: gasto._id}); 
    res.json(gastoPersistido);
  } else {
    res.status(500).send("Algún dato es incorrecto");
  }
});

// Edita un gasto
router.put('/:id', authMiddleware.auth, async (req, res) =>{
  const user = authMiddleware.getUserFromRequest(req);
  const gasto = req.body;
  gasto.user = user;
  gasto.tipo = myType;
  gasto._id = req.params.id;
  
  const gastoDb = await dataGastos.getGasto({id: gasto._id, user: user});
  if (gastoDb && gastoDb.user === gasto.user){
    const isValid = await isGastoValido(gasto);
    if (isValid){
      await dataGastos.updateGasto(gasto);
      res.json(await dataGastos.getGasto({id: gasto._id, user: user}))
    } else {
      res.status(500).send("Algún dato es incorrecto");
    }
  } else {
    res.status(403).send("Acceso denegado");
  }
});

// Elimina un gasto
router.delete('/:id', authMiddleware.auth, async (req,res) => {
  const user = authMiddleware.getUserFromRequest(req);
  const gastoId = req.params.id;
  const gastoDb = await dataGastos.getGasto({id: gastoId, user: user});
  if (gastoDb && gastoDb.user === user){
    await dataGastos.deleteGasto({id: gastoId, user: user});
    res.send('Gasto eliminado');
  } else {
    res.status(403).send("Acceso denegado");
  }
});

async function isGastoValido(gasto){
  const tiposPago = ['Tarjeta', 'Contado'];
  if (gasto.monto > 0 &&  tiposPago.includes(gasto.tipoPago) &&
      await dataCategorias.getAllCategorias({user: gasto.user, tipo: gasto.tipo})
        .then(categorias => {
          return categorias.find(x => x.nombre === gasto.categoria)
        })
      )
  {
    return true;
  } else {
    return false;
  }
}


module.exports = router;

const express = require('express');
const router = express.Router();
const dataTarjeta = require('../data/tarjeta'); 
const authMiddleware = require('../middleware/auth');

async function tarjetaValida(tarjeta){
  if ((tarjeta.idUsuario !== null ) && ( tarjeta.nombre !== null)){
    return true;
  } else {
    return false;
  }
}
// Trae todas las tarjetas
router.get('/', authMiddleware.auth, async (req, res) => {
  res.json( await dataTarjeta.getAllTarjetas() );
});

//Trae la tarjeta por :id
router.get('/:id', authMiddleware.auth, async (req, res) =>{
  await dataTarjeta.getTarjeta(req.params.id);
  res.json(tarjeta)
});

// Agrega una tarjeta
router.post('/', authMiddleware.auth, async (req, res) => {
  const tarjeta= req.body
  if (await tarjetaValida(tarjeta)){
    await dataTarjeta.pushTarjeta(tarjeta)
    const tarjetaPersistida = await dataTarjeta.getTarjeta(tarjeta._id)
    res.json(tarjetaPersistida);
  }
  else{
    res.status(500).send("Algun dato es nulo");
  }
});

// actualiza una tarjeta
router.put('/:id', authMiddleware.auth, async (req, res) =>{
  const tarjeta= req.body
  tarjeta._id= req.params.id
  if (await tarjetaValida(tarjeta)){
    await dataTarjeta.updateTarjeta(tarjeta)
    res.json(await dataTarjeta.getTarjeta(req.params.id));
  }
  else{
    res.status(500).send("Algun dato es nulo");
  }
});

// Elimina una tarjeta
router.delete('/:id', async (req,res) => {
  await dataTarjeta.deleteTarjeta(req.params.id);
  res.send('tarjeta eliminada');
});

module.exports = router;
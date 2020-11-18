var express = require('express');
const authMiddleware = require('../middleware/auth');
const dataGastos = require('../data/gasto');
const dataIngresos = require('../data/ingreso');
var router = express.Router();

/* GET users listing. */
router.get('/gasto/ultimo-seis-meses', authMiddleware.auth, async (req, res) => {
  
  const user = authMiddleware.getUserFromRequest(req);
  const ultimoSeis = await dataGastos.getSeisMeses({user: user});
  res.json(ultimoSeis)  

});

router.get('/ingreso/ultimo-seis-meses', authMiddleware.auth, async (req, res) => {
  
  const user = authMiddleware.getUserFromRequest(req);
  const ultimoSeis = await dataIngresos.getSeisMeses({user: user});
  res.json(ultimoSeis)
  
});

module.exports = router;

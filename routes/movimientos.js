var express = require('express');
var router = express.Router();
const dataMovimientos = require('../data/movimiento');


router.get('/', async (req, res, next) =>{
  res.json( await dataMovimientos.getAllMovimientosDesc());
});

module.exports = router;
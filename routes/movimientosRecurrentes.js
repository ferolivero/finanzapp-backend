var express = require('express');
const { TooManyRequests } = require('http-errors');
var router = express.Router();
const dataMovimientosRecurrentes = require('../data/movimientoRecurrente');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  console.log('user', user)
  const result = await dataMovimientosRecurrentes.getAllMovimientosDesc({ user: user })
  res.json(result)
})

module.exports = router

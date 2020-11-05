var express = require('express');
var router = express.Router();
const dataMovimientos = require('../data/movimiento');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req);
  const result = await dataMovimientos.getAllMovimientosDesc({user: user})
  res.json(result);
});

module.exports = router;
var express = require('express');
const authMiddleware = require('../middleware/auth');
var router = express.Router();
const userData = require('../data/user')

/* Trae todos los datos del usuario */
router.get('/', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req);

  const result = await userData.getUsuarioDatos(req.db, { _id: user })
  res.json(result)
})

module.exports = router;

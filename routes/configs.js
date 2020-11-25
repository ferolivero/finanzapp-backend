var express = require('express');
const authMiddleware = require('../middleware/auth');
var router = express.Router();
const userData = require('../data/user')


router.get('/user', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await userData.getUsuario(req.db, {
    id: user,
  })
  res.json(result)
})

module.exports = router;

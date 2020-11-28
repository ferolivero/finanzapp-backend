var express = require('express')
const authMiddleware = require('../middleware/auth')
var router = express.Router()
const userData = require('../data/user')

router.get('/user', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const result = await userData.getUsuario(req.db, {
    id: user,
  })
  res.json(result)
})

router.put('/user', authMiddleware.auth, async (req, res) => {
  const user = authMiddleware.getUserFromRequest(req)
  const userBody = req.body
  if (user === userBody._id) {
    const userDb = await userData.getUsuario(req.db, {
      id: user,
    })

    console.log(userDb._id)
    console.log(user)
    if (userDb && userDb._id === user) {
      await userData.updateUsuario(req.db, userBody)
      res.json(await userData.getUsuario(req.db, { id: user }))
    } else {
      res.status(403).send('Acceso denegado')
    }
  } else {
    res.status(403).send('Acceso denegado')
  }
})

module.exports = router

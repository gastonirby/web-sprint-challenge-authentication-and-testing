const router = require('express').Router();
const bcrypt = require('bcryptjs')
const db = require('../../data/dbConfig')
const tokenBuilder = require('./auth-token-builder')
const 
  {
    checkUsernameLogin,
    checkBodyExists,
    checkUsernameRegister
  } = require('./auth-middleware')

router.post('/register', checkBodyExists, checkUsernameRegister, async (req, res, next) => {
      let user = req.body
      const hash = bcrypt.hashSync(user.password, 8)
      user.password = hash
      const id  = await db('users').insert(user)
      const User = await db('users').where('id', id).first()
      res.status(201).json(User)
});

router.post('/login', checkBodyExists, checkUsernameLogin, async (req, res, next) => {
      const { username, password } = req.body
      await db('users').where({ username })
        .then(([user]) => {
          if(user && bcrypt.compareSync(password, user.password)) {
            const token = tokenBuilder(user)
            res.json({ message: `welcome, ${user.username}`, token })
          } else {
            next({ status: 401, message: 'Invalid Credentials' })
          }
        })
});

module.exports = router;
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
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!
    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }
    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }
    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
      let user = req.body
  const hash = bcrypt.hashSync(user.password, 8)
  user.password = hash
  const id  = await db('users').insert(user)
  const User = await db('users').where('id', id).first()
  res.status(201).json(User)
});

router.post('/login', checkBodyExists, checkUsernameLogin, async (req, res, next) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }
    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }
    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
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
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../secrets");

module.exports = (req, res, next) => {
      const token = req.headers.authorization
      if (!token) return next
        ({ 
          status: 401, 
          message: 'Token required' 
        })
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return next
          ({ 
            status: 401, 
            message: 'Token invalid' 
          })
        req.decodedJwt = decoded
        next()
      })
    };
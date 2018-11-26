const router = require('express').Router()
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const config = require('../config')

router.post('/signup', (req, res, next) => {
  let user = new User()
  user.name = req.body.name
  user.email = req.body.email
  user.password = req.body.password
  user.picture = user.gravatar
  user.isSeller = req.body.isSeller

  User.findOne({
    email: req.body.email
  }, (err, existingUser) => {
    if (existingUser) {
      res.json({
        success: false,
        message: 'Account with that email already exists'  
      })
    } else {
      user.save()
      var token = jwt.sign({
        user: user
      }, config.secret, {
        expiresIn: '7d'
      })

      res.json({
        success: true,
        message: 'success',
        token: token
      })
    }
  })
})

router.post('/login', (req, res, next) => {
  User.findOne({email: req.body.email}, (err, user) => {
    if(err) {
      throw err
    }
    if(!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      })
    } else if (user) {
      var isPasswordValid = user.comparePassword(req.body.password)
      if(!isPasswordValid) {
        res.json({
          success: false,
          message: 'Authentication failed. Incorrect Password'
        })
      } else {
        var token = jwt.sign({
          user: user
        }, config.secret, {
          expiresIn: '7d'
        })
        res.json({
          success: true,
          message: 'Authenticated',
          token: token
        })
      }
    }
  })
})

module.exports = router
const express = require('express')

const router = express.Router()

const authControl = require('../controllers/auth')

router.get('/login', authControl.getLogin)

router.get('/signup', authControl.getSignup)

router.post('/login', authControl.postLogin)

router.post('/signup', authControl.postSignup)

router.post('/logout', authControl.postLogout)

module.exports = router
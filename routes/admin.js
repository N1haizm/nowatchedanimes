const express = require('express')
const path = require('path')

const adminControl = require('../controllers/admin')
const isAuth = require('../middleware/isauth')

const router = express.Router()

router.get('/add-anime', isAuth, adminControl.getAddAnime)

router.post('/add-anime', isAuth, adminControl.postAddAnime)

router.get('/animes', isAuth, adminControl.getAdminAnimes)

router.get('/edit-anime/:animeId', isAuth, adminControl.getEditAnime)

router.post('/edit-anime', isAuth, adminControl.postEditAnime)

router.post('/delete-anime', isAuth, adminControl.postDeleteAnime)

module.exports = router
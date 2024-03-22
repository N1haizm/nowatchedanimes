const express = require('express')
const path = require('path')

const animesControl = require('../controllers/animes')
const isAuth = require('../middleware/isauth')

const router = express.Router()

router.get('/', animesControl.getIndex)

router.get('/animes', animesControl.getAnimes)

router.get('/animes/:animeId', animesControl.getAnime)

router.get('/deck', isAuth, animesControl.getDeck)

router.post('/deck', isAuth, animesControl.postDeck)

router.post('/deck-delete-item', isAuth, animesControl.deckDeleteItem)

router.post('/create-order', isAuth, animesControl.postOrder)

router.get('/orders', isAuth, animesControl.getOrders)

module.exports = router
const Anime = require('../models/anime')

exports.getIndex = async (rq, rs) => {
  const animes = await Anime.find()
  rs.render('market/index', {
    ani: animes,
    pageTitle: 'Market',
    path: '/'
  })
}

exports.getAnimes = async (rq, rs) => {
    const animes = await Anime.find()
    rs.render('market/anime-list', {
        ani: animes,
        pageTitle: 'All animes',
        path: '/animes'
    })
  }

exports.getAnime = (rq, rs) => {
  const animeId = rq.params.animeId
  Anime.findOne({_id: animeId})
    .then(anime => {
      rs.render('market/anime-detail', {
        anime: anime,
        pageTitle: anime.title,
        path: '/animes'
      })
    })
}

exports.getDeck = (rq, rs) => {
    rq.user
    .populate('deck.items.animeId')
    .then(user => {
      console.log(user.deck.items)
      const animes = user.deck.items
      rs.render('market/deck', {
        pageTitle: 'Your deck',
        path: '/deck',
        animes: animes
      })
    })
}

exports.postDeck = async (rq, rs) => {
    const animeId = rq.body.animeId
    const anime = await Anime.findById(animeId)
    const added = await rq.user.addToDeck(anime)
    console.log(added)
    rs.redirect('/deck')
}

exports.deckDeleteItem = async (rq, rs) => {
    const animeId = rq.body.animeId
    await rq.user.deleteFromDeck(animeId)
    rs.redirect('/deck')
}

exports.postOrder = async (rq, rs) => {
    await rq.user.addOrder()
    rs.redirect('/orders')
}

exports.getOrders = async (rq, rs) => {
    const orders = await rq.user.getOrders()
    rs.render('market/orders', {
        pageTitle: 'Your orders',
        path: '/orders',
        orders: orders
    })
}



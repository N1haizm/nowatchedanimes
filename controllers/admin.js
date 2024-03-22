const Anime = require('../models/anime')

exports.getAddAnime = (rq, rs) => {
  rs.render('admin/edit-anime', {
    pageTitle: 'Add anime',
    path: '/admin/add-anime',
    editing: false
  })
}

exports.postAddAnime = (rq, rs) => {
  const title = rq.body.title
  const image = rq.file
  const score = rq.body.score
  const description = rq.body.description

  const imageUrl = image.path;

  const anime = new Anime({
    title: title,
    score: score,
    description: description,
    imageUrl: imageUrl,
    userId: rq.user
  })
  anime.save()
    .then(res => {
      console.log(res)
      rs.redirect('/admin/animes')
    })
    .catch(err=> {
      console.log(err)
    })
}

exports.getEditAnime = async (rq, rs) => {
  const editMode = rq.query.edit
  const animeId = rq.params.animeId
  if(!editMode){
    return rs.redirect('/')
  }
  const anime = await Anime.findById(animeId)
  if(!anime){
    return rs.redirect('/')
  }
  rs.render('admin/edit-anime', {
    pageTitle: 'Edit anime',
    path: '/admin/edit-anime',
    editing: editMode,
    anime: anime
  })
}

exports.postEditAnime = async (rq, rs) => {
    const id = rq.body.animeId
    const updatedTitle = rq.body.title
    const updatedDescription = rq.body.description
    const image = rq.file
    const updatedScore = rq.body.score

    const anime = await Anime.findById(id)
    anime.title = updatedTitle
    anime.score = updatedScore
    anime.description = updatedDescription
    if (image) {
      anime.imageUrl = image.path
    }

    anime.save()
      .then(res => {
        console.log('anime updated')
        rs.redirect('/admin/animes')
      })
      .catch(err => console.log(err))
}

exports.postDeleteAnime = async (rq, rs) => {
    const animeId = rq.body.animeId
    await Anime.deleteOne({ _id: animeId })
    rs.redirect('/admin/animes')
}

exports.getAdminAnimes = async (rq, rs) => {
  const animes = await Anime.find()
  rs.render('admin/animes', {
    ani: animes,
    pageTitle: 'Admin animes',
    path: '/admin/animes'
  })
}
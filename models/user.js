const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Order = require('./order')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    deck: {
        items: [{
            animeId: { type: Schema.Types.ObjectId, ref: 'Anime', required: true }, 
            quantity: { type: Number, required: true }
        }]
    }
})

userSchema.methods.addToDeck = function(anime){
        const deckAnimeIndex = this.deck.items.findIndex(a => anime._id.toString() === a.animeId.toString())
        const updatedAnimes = [...this.deck.items]
        let newQuantity = 1
        if(deckAnimeIndex >= 0){
            newQuantity = this.deck.items[deckAnimeIndex].quantity + 1
            updatedAnimes[deckAnimeIndex].quantity = newQuantity
        } else {
            updatedAnimes.push({ animeId: anime._id, quantity: newQuantity})
        }

        const updatedDeck = {
            items: updatedAnimes
        }

        this.deck = updatedDeck
        return this.save()
}

userSchema.methods.deleteFromDeck = function(id) {
    const updatedDeckItems = this.deck.items.filter(item => {
        return item.animeId.toString() !== id.toString()
    })
    this.deck.items = updatedDeckItems
    return this.save()
}

userSchema.methods.addOrder = function(){   
    const order = new Order({
        items: this.deck.items,
        userId: this._id
    })
    this.deck.items = []
    return Promise.all([order.save(), this.save()])
}

userSchema.methods.getOrders = function(){
    return Order.find({ userId: this._id}).populate('items.animeId')
}

module.exports = mongoose.model('User', userSchema)

// const { ObjectId } = require('mongodb');

// class User {
//     constructor(username, email, deck, id){
//         this.name = username
//         this.email = email
//         this.deck = deck
//         this._id = id
//     }

//     async save() {
//         const db = getDb()
//         return await db.collection('users').insertOne(this)
//     }

//     addToDeck(anime) {
//         const deckAnimeIndex = this.deck.items.findIndex(a => anime._id.toString() === a.animeId.toString())
//         const updatedAnimes = [...this.deck.items]
//         let newQuantity = 1
//         if(deckAnimeIndex >= 0){
//             newQuantity = this.deck.items[deckAnimeIndex].quantity + 1
//             updatedAnimes[deckAnimeIndex].quantity = newQuantity
//         } else {
//             updatedAnimes.push({ animeId: new ObjectId(anime._id), quantity: newQuantity})
//         }
//         const updatedDeck = {items: updatedAnimes}
//         const db = getDb()
//         return db.collection('users').updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: {deck: updatedDeck} }
//         )
//     }

//     getDeck(){
//         const db = getDb()
//         const animeIds = this.deck.items.map(i => i.animeId)
//         return db.collection('animes').find({_id: {$in: animeIds}}).toArray()
//             .then(animes => {
//                 return animes.map(anime => {
//                     return {
//                         ...anime,
//                         quantity: this.deck.items.find(i => {
//                             return i.animeId.toString() === anime._id.toString()
//                         }).quantity
//                     }
//                 })
//             })
//     }

//     deleteFromDeck = id => {
//         const updatedDeckItems = this.deck.items.filter(item => {
//             return item.animeId.toString() !== id.toString()
//         })
//         const db = getDb()
//         return db.collection('users').updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: {deck: {items: updatedDeckItems}} }
//         )
//     }

//     addOrder() {
//         const db = getDb()
//         return this.getDeck().then(animes => {
//             const order = {
//                 items: animes,
//                 user: {
//                     _id: new ObjectId(this._id),
//                     name: this.name
//                 }
//             }
//             return db.collection('orders')
//             .insertOne(order)
//         })
//             .then(res => {
//                 this.deck = {items: []}
//                 return db.collection('users').updateOne(
//                     { _id: new ObjectId(this._id) },
//                     { $set: {deck: {items: []}} }
//                 )
//             })
//     }

//     getOrders(){
//         const db = getDb()
//         return db.collection('orders').find({'user._id': this._id}).toArray()
//     }

//     static fetchById = async id => {
//         const db = getDb()
//         return await db.collection('users').findOne({ _id: new ObjectId(id)})
//     }
// }
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const animeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Anime', animeSchema)


// const mongodb = require('mongodb')

// class Anime {
//     constructor(title, score, description, imageUrl, id, userId){
//         this.title = title
//         this.score = score
//         this.description = description
//         this.imageUrl = imageUrl
//         this._id = id? new mongodb.ObjectId(id): null
//         this.userId = userId
//     }

//     save(){
//         const db = getDb()
//         let dbOp;
//         if(this._id){
//             dbOp = db.collection('animes').updateOne({ _id: this._id}, {$set: this})
//         } else {
//             dbOp = db.collection('animes').insertOne(this)
//         }
//         return dbOp
//             .then(res => {
//                 console.log(res)
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }
    
//     static async fetchAll(){
//         const db = getDb()
//         return await db.collection('animes').find().toArray()
//     }

//     static fetchOne = id => {
//         const db = getDb()
//         return db.collection('animes').find({ _id: new mongodb.ObjectId(id) }).next()
//             .then(anime => {
//                 console.log(anime)
//                 return anime
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }

//     static deleteById = async id => {
//         const db = getDb()
//         return await db.collection('animes').deleteOne({_id: new mongodb.ObjectId(id)})
//     }
// }

// module.exports = Anime
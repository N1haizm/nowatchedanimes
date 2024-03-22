const mongoose = require('mongoose')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    items: [{ 
        animeId: { type: Schema.Types.ObjectId, ref: 'Anime', required: true }, 
        quantity: { type: Number, required: true }
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Order', orderSchema)
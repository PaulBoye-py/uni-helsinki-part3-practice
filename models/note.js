const mongoose = require('mongoose')
require('dotenv').config(); // Load environment variables

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

// Create mongoose schema
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    important: Boolean,
})

// Modify noteSchema
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)
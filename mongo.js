const mongoose = require('mongoose')
require('dotenv').config(); // Load environment variables

if (!process.env.MONGODB_PASSWORD && process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${process.env.MONGODB_PASSWORD || password}@practice.uhwifmw.mongodb.net/?retryWrites=true&w=majority&appName=practice`

mongoose.set('strictQuery', false)

mongoose.connect(url)

// Create mongoose schema
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

// Create mongoose model
const Note = mongoose.model('Note', noteSchema)

// Create a new note
const note = new Note({
    content: 'Life is easy',
    important: true,
})

// Generate a new note
// note.save().then(result => {
//     console.log('note saved!')
//     console.log(result)
//     mongoose.connection.close()
// })

// Retrieve note objects
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})


require('dotenv').config(); // Load environment variables
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

app.use(express.static('dist'))
app.use(express.json())
// app.use(requestLogger)
app.use(cors())



// if (!process.env.MONGODB_PASSWORD && process.argv.length<3) {
//     console.log('give password as argument')
//     process.exit(1)
// }

// const password = process.argv[2]

// const url = `mongodb+srv://fullstack:${process.env.MONGODB_PASSWORD || password}@practice.uhwifmw.mongodb.net/?retryWrites=true&w=majority&appName=practice`


// mongoose.connect(url)



// Create mongoose model
// const Note = mongoose.model('Note', noteSchema)

let notes = [
    {
        id: 1,
        content: 'HTML is easy',
        important: true,
    },
    {
        id: 2,
        content: 'Browser can execute only JS',
        important: false,
    },
    {
        id: 3,
        content: 'GET and POST are the most important methods of HTTP protocol',
        important: true,
    }
]

// Base
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// Fetch a single note

// app.get('/api/notes/:id/', (request, response) => {
//     const id = Number(request.params.id) 
//     const note = notes.find(note => note.id === id)
//     if (note) {
//         response.json(note)
//     } else {
//         response.status(404).end()
//     } 
// })

// Fetch a single note using Mongoose
app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Fetch all notes
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

// Delete a note
app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})
// Generate ID dynamically
// const generateId = () => {
//     const maxId = notes.length > 0
//         ? Math.max(...notes.map(n => n.id)) 
//         : 0
//     return maxId + 1
// }

// Create a note
app.post('/api/notes', (request, response, next) => {
    const body = request.body

    if (!body.content === undefined ) {
        return response.status(404).json({
            error: 'Content missing'
        })
    }

    const note = new Note ({
        content: body.content,
        important: Boolean(body.important) || false,
    })

    // notes = notes.concat(note)
    // console.log(note)
    note.save()
        .then(savedNote => {
        response.json(savedNote)
        })
        .catch(error => next(error))   
})

// Modify a note
app.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body

    // the { new: true } causes the updatedNote event handler to be called with the modified note
    Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

// Handler of requests with unknown endpoints
app.use(unknownEndpoint)

// Centralized error-handling middleware
const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: `malformatted id` })
    } else if (error.name === `ValidationError`) {
        return response.status(400).json({ error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on ${PORT}`)

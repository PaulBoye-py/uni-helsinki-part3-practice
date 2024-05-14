const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.use(express.static('dist'))

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


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes/:id/', (request, response) => {
    const id = Number(request.params.id) 
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    } 
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id)) 
        : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(404).json({
            error: 'Content missing'
        })
    }

    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId(),
    }

    notes = notes.concat(note)
    console.log(note)
    response.json(note)
})

app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const body = request.body

    const noteIndex = notes.findIndex(note => note.id === id)
    if (noteIndex !== -1) {
        const updatedNote = {
            id: id,
            content: body.content,
            important: Boolean(body.important) || false
        }
        notes[noteIndex] = updatedNote
        response.json(updatedNote)
    } else {
        response.status(404).json({ error: 'Note not found' })
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on ${PORT}`)

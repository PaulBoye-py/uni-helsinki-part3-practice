const notesRouter = require('express').Router()
const Note = require('../models/note')

// Get all notes
notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
    response.json(notes)
    console.log(notes)
})

// Get a specific note by ID
notesRouter.get('/:id', async (request, response) => {
    const note = await Note.findById(request.params.id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

// Post a new note
notesRouter.post('/', async (request, response) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    const savedNote = await note.save()
    response.status(201).json(savedNote)
})

// Delete a note
notesRouter.delete('/:id', async (request, response) => {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

// Modify a note
notesRouter.put('/:id', async (request, response) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }
 
    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
    response.json(updatedNote)
    
})

module.exports = notesRouter
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe.only('when there is initially only one user in the DB', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
       

        await user.save()
    })

    test.only('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'adeboye',
            name: 'Paul Aderoju',
            password: 'asderoju'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test.only('creation fails with proper status code amd message if username is already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'SuperUser',
            password: 'akgfdsf',
        }

        const result = await api
            .post('/api/users/')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
})

after(async () => {
    await mongoose.connection.close()
  })


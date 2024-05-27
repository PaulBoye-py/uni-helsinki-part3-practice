require ('dotenv').config()
// Printing normal log messages
const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params)
    }
}

// Printing error messages
const error = (...error) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...error)
    }
}

module.exports = {
    info, error
}
const express = require('express')
const cookieParser = require('cookie-parser')
const bugService = require('./services/bug.service.js')
const userService = require('./services/user.service.js')

const app = express()


// App configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// Real routing express
// List
app.get('/api/bug', (req, res) => {
    const { title, labels, minSeverity, pageIdx, pageSize, sortByCat, desc } = req.query
    const sortBy = {
        sortByCat, desc
    }
    const filterBy = {
        title, labels, minSeverity, pageIdx, pageSize
    }
    bugService.query(filterBy, sortBy).then((bugs) => {
        res.send(bugs)
    }) .catch(err => {
        console.log('Error:', err)
        res.status(400).send('Cannot get cars')
    })
})

// Create
app.put('/api/bug/', (req, res) => {
    const bug = req.body
    bugService.save(bug).then((savedBug) => {
        res.send(savedBug)
    })
})

// Update
app.put('/api/bug/:bugId', (req, res) => {
    const bug = req.body
    bugService.save(bug).then((savedBug) => {
        res.send(savedBug)
    })
})


// Read - GetById
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.get(bugId)
        .then((bug) => {
            res.send(bug)
        })
        .catch(err => {
            res.status(404).send(err.message)
        })
})

// Remove
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId).then(() => {
        res.send({ msg: 'Bug removed successfully', bugId })
    })
})




// Listen will always be the last line in our server!
app.listen(3030, () => console.log('Server listening on port 3030!'))


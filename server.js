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
    const { title, labels, minSeverity, pageIdx, pageSize, sortByCategory: sortByCategory, desc } = req.query
    const sortBy = {
        sortByCategory: sortByCategory, desc
    }
    const filterBy = {
        title, labels, minSeverity, pageIdx, pageSize
    }
    bugService.query(filterBy, sortBy).then((bugs) => {
        res.send(bugs)
    }).catch(err => {
        console.log('Error:', err)
        res.status(400).send('Cannot get bugs')
    })
})

// Create
app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')
    const bug = req.body
    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        }).catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot create bug')
        })
})

// Update
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot uptade car')
    const bug = req.body

    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        }).catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot update car')
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
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update car')

    const { bugId } = req.params
    bugService.remove(bugId).then(() => {
        res.send({ msg: 'Bug removed successfully', bugId })
    }).catch(err => {
        console.log('Error:', err)
        res.status(400).send('Cannot delete bug')
    })
})

app.get('/api/user', (req, res) => {
    // const { userId } = req.paramsS
    userService.query()
        .then(users => {
            res.send(users)
        }).catch(err => {
            res.status(400).send('Canoot get users')
        })

})

app.get('/api/users/:userId', (req, res) => {
    const { userId } = req.params
    userService.get(userId)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.status(400).send('Cannot get user')
        })
})

app.post('/api/user/:userId', (req, res) => {
    const { userId, password } = req.params
    userService.login({ username, password })
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get user')
        })
})

app.post('/api/user/signup', (req, res) => {
    const { fullname, username, password } = req.body
    userService.signup({ fullname, username, password })
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            res.status(400).send('Cannot signup')
        })
})

app.post('api/user/logout',(res,req)=>{
    res.clearCookie('loginToken')
    res.send('Loggen out')
})


// Listen will always be the last line in our server!
app.listen(3030, () => console.log('Server listening on port 3030!'))


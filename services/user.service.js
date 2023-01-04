const fs = require('fs');

var users = require('../data/user.json')


module.exports = {
    query,
    get,
    remove,
    login,
    signup,
    getLoginToken,
    validateToken
}

function query(filterBy) {
    let fillteredUsers = users
    return Promise.resolve(fillteredUsers)
}

function get(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found')
    return Promise.resolve(user)
}

function remove(userId, loggedinUser) {
    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) return Promise.reject('No Such User')
    const user = users[idx]
    if (user.owner._id !== loggedinUser._id) return Promise.reject('Not your User')
    users.splice(idx, 1)
    return _saveUsersToFile()
}


function save(user, loggedinUser) {
    if (user._id) {
        const userToUpdate = users.find(currUser => currUser._id === user._id)
        if (!userToUpdate) return Promise.reject('No such User')
        if (userToUpdate.owner._id !== loggedinUser._id) return Promise.reject('Not your User')

        userToUpdate.vendor = user.vendor
        userToUpdate.speed = user.speed
    } else {
        user._id = _makeId()
        user.owner = loggedinUser
        users.push(user)
    }
    return _writeUsersToFile().then(() => user)
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


function _writeUsersToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', data, (err) => {
            if (err) return rej(err)
            // console.log("File written successfully\n");
            res()
        });
    })
}
const fs = require('fs');
// const PAGE_SIZE = 4
var bugs = require('../data/bug.json')

module.exports = {
    query,
    get,
    remove,
    save
}

function query(filterBy, sortBy) {
    let filteredBugs = bugs
    // Filtering
    if (filterBy.title) {
        sortByCategory
        const regex = new RegExp(filterBy.title, 'i')
        filteredBugs = filteredBugs.filter(bug => regex.test(bug.title))
    }
    if (filterBy.labels) {
        const labels = filterBy.labels.split(',')
        // console.log(labels);
        filteredBugs = filteredBugs.filter(bug => labels.every(i => bug.labels.includes(i)))
    }
    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= +filterBy.minSeverity)
    }

    // Sorting
    if (sortBy) {
        if (sortBy.sortByCategory === 'createdAt' || sortBy.sortByCategory === 'severity') {
            filteredBugs.sort((b1, b2) => (b1[sortBy.sortByCategory] - b2[sortBy.sortByCategory]) * sortBy.desc)
        }
        if (filterBy.sortBy === 'title') {
            filteredBugs.sort((b1, b2) => b1.title.localeCompare(b2.title) * sortBy.desc)
        }
    }

    // Paging
    const totalPages = Math.ceil(filteredBugs.length / +filterBy.pageSize)
    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * +filterBy.pageSize
        filteredBugs = filteredBugs.slice(startIdx, +filterBy.pageSize + startIdx)
    }

    return Promise.resolve({ totalPages, bugs: filteredBugs })
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Car not found')
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No such bug')
    const bug = bugs[idx]
    if (bug.owner._id !== loggedinUser._id) return Promise.reject('Not your Bug')
    bugs.splice(idx, 1)
    return _writeBugsToFile()
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugToUpdate = bugs.find(currbug => currbug._id === bug._id)
        if (!bugToUpdate) return Promise.reject('No such Car')
        if (bugToUpdate.owner._id !== loggedinUser._id) return Promise.reject('Not your Bug')
        bugToUpdate.title = bug.title
        bugToUpdate.descprition = bug.descprition
        bugToUpdate.severity = bug.severity
    } else {
        bug._id = _makeId()
        bug.owner = loggedinUser
 
        bugs.push(bug)
    }
    return _writeBugsToFile().then(() => bug)
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


function _writeBugsToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return rej(err)
            // console.log("File written successfully\n");
            res()
        });
    })
}
// DEPENDENCIES 
const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db/db');
const uniqid = require('uniqid');
const dbJsonPath = path.join(__dirname, './db/db.json');

// SET-UP EXPRESS APP
const app = express();
const PORT = process.env.PORT || 3000;

// SETS UP DATA FOR THE EXPRESS APP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CSS & JS (recommended by teaching staff)
app.use(express.static(__dirname + '/public'));

// ROUTES
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

// GET (requests and parses the data from db.json file)
app.get('/api/notes', (req, res) => res.json(db));

// POST (posts and stringifies the data from the notes file)
app.post('/api/notes', (req, res) => {

    let newNote = req.body;

    newNote.id = uniqid();
    db.push(newNote);
    fs.writeFile(dbJsonPath, JSON.stringify(db), err =>
        err ? console.log(err) : console.log('Note successfully saved.'));
    res.json(newNote);
});

// DELETE api/note with the corresponding id
app.delete('/api/notes/:id', (req, res) => {

    const noteID = req.params.id;

    for (let i = 0; i < db.length; i++) {
        if (db[i].id == noteID) {
            db.splice(i, 1);
        }
    };

    fs.writeFile(dbJsonPath, JSON.stringify(db), err =>
        err ? console.log(err) : console.log('Note successfully deleted.'));
    res.json(db);
});

// INITIATE SERVER LISTENING
app.listen(PORT, () => console.log(`Listening on PORT:${PORT}, available at http//localhost:${PORT}`));
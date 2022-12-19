const { faker } = require('@faker-js/faker');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');

app.get('/random-users', (req, res) => {
    fetch('https://randomuser.me/api?results=10')
        .then(response => response.json())
        .then(data => {
            res.send(data);
        });
});




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

let users = [];

// POST /users
app.post('/users', (req, res) => {
    // create a new user from the request body
    const user = req.body;

    // save the user in the database or in-memory store
    users.push(user);

    // return the saved user
    res.json(user);
});

// GET /users
app.get('/users', (req, res) => {
    // fetch saved users and mix them with random users
    const mixedUsers = [...users, ...fetchRandomUsers()];

    // return the mixed users
    res.json({user: mixedUsers});
});

// DELETE /users
app.delete('/users/:id', (req, res) => {
    // get the id of the user to delete from the request parameters
    const id = req.params.id;

    // find the index of the user in the users array
    const index = users.findIndex(user => user.id === id);

    // remove the user from the array
    users.splice(index, 1);

    // return a message indicating that the user was deleted
    res.send(`User with id ${id} deleted`);
});

function fetchRandomUsers() {
    const numUsers = Math.floor(Math.random() * 10) + 1;
    const users = [];
    for (let i = 0; i < numUsers; i++) {
        const user = {
            id: faker.datatype.uuid(),
            name: faker.internet.userName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar()
        };
        users.push(user);
    }
    return users;
}

// start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
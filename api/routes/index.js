var express = require('express');
var router = express.Router();
const fs = require('fs');

let data = require('../data/db.json');

// GET user with ID
router.get('/user/:id', function (req, res, next) {
  const id = parseInt(req.params.id);

  let user = getUserById(id);
  if (user) return res.json(user);

  // Create new user

  let databaseRaw = fs.readFileSync('./data/db.json', 'utf8');
  let database = JSON.parse(databaseRaw);

  user = { id: id, name: 'Ny Användare', money: 0 };
  database.users.push(user);

  const newData = JSON.stringify(database, null, 2);
  fs.writeFile('./data/db.json', newData, (err) => {
    if (err) throw err;
    return res.json(user);
  });
});

// POST user with ID
router.post('/user/:id', function (req, res, next) {
  const id = parseInt(req.params.id);

  let databaseRaw = fs.readFileSync('./data/db.json', 'utf8');
  let database = JSON.parse(databaseRaw);

  const index = database.users.findIndex((user) => user.id === id);

  if (req.body.name) {
    database.users[index].name = req.body.name;
  }
  if (req.body.money) {
    database.users[index].money = req.body.money;
  }

  const newData = JSON.stringify(database, null, 2);
  fs.writeFile('./data/db.json', newData, (err) => {
    if (err) throw err;
    res.status(200).send('Updated user');
  });
});

// POST user
// router.post('/user', function (req, res, next) {
//   let db = fs.readFileSync('./data/db.json', 'utf8');
//   let myObject = JSON.parse(db);
//   myObject.plots.push(req.users);
//   let newData = JSON.stringify(myObject, null, 2);

//   fs.writeFile('./data/db.json', newData, (err) => {
//     if (err) throw err;
//     res.status(201).send('New user added');
//   });
// });

// GET plots
router.get('/plots', function (req, res, next) {
  let databaseRaw = fs.readFileSync('./data/db.json', 'utf8');
  let database = JSON.parse(databaseRaw);
  console.log('Sending this shit:', database.plots);
  return res.json(database.plots);
});

// POST plots
router.post('/plots', function (req, res, next) {
  let databaseRaw = fs.readFileSync('./data/db.json', 'utf8');
  let database = JSON.parse(databaseRaw);
  database.plots.push(req.body);
  let newData = JSON.stringify(database, null, 2);

  fs.writeFile('./data/db.json', newData, (err) => {
    if (err) throw err;
    res.status(201).send('New plot added');
  });
});

router.post('/plots/:id', function (req, res, next) {
  let db = fs.readFileSync('./data/db.json', 'utf8');
  let myObject = JSON.parse(db);

  let plots = [];
  for (i = 0; i < data.plots.length; i++) {
    if (i != req.params.id) {
      plots.push(data.plots[i]);
    }
  }

  myObject.plots = plots;

  let newData = JSON.stringify(myObject, null, 2);

  fs.writeFile('./data/db.json', newData, (err) => {
    if (err) throw err;
    res.status(201).send('Plot removed');
  });
});

function getUserById(userId) {
  for (let i = 0; i < data.users.length; i++) {
    const user = data.users[i];
    if (user.id == userId) {
      return user;
    }
  }
}

module.exports = router;

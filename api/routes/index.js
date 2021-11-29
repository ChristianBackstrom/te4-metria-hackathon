var express = require('express');
var router = express.Router();
const fs = require('fs');

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
  fs.writeFileSync('./data/db.json', newData, (err) => {
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
  try {
    const data = fs.writeFileSync('./data/db.json', newData);
    // res.json({ message: 'File written successfully!' });
  } catch (error) {
    if (error) return error;
  }

  // Test read again

  databaseRaw = fs.readFileSync('./data/db.json', 'utf8');
  database = JSON.parse(databaseRaw);

  console.log('Reading user again', database);

  // fs.writeFileSync('./data/db.json', newData, (err) => {
  //   if (err) throw err;
  //   return res.status(200).send('Updated user');
  // });
});

// GET plots
router.get('/plots', function (req, res, next) {
  let databaseRaw = fs.readFileSync('./data/db.json', 'utf8');
  let database = JSON.parse(databaseRaw);
  return res.json(database.plots);
});

// Add plot
router.post('/plots', function (req, res, next) {
  let databaseRaw = fs.readFileSync('./data/db.json', 'utf8');
  let database = JSON.parse(databaseRaw);
  database.plots.push(req.body);
  let newData = JSON.stringify(database, null, 2);

  try {
    fs.writeFileSync('./data/db.json', newData);
  } catch (error) {}
  res.status(201).json(req.body);

  // Test read again

  databaseRaw = fs.readFileSync('./data/db.json', 'utf8');
  database = JSON.parse(databaseRaw);

  console.log('Reading plots again', database);
});

// Remove plot
// router.post('/plots/:id', function (req, res, next) {
//   let db = fs.readFileSync('./data/db.json', 'utf8');
//   let myObject = JSON.parse(db);

//   let plots = [];
//   for (i = 0; i < myObject.plots.length; i++) {
//     if (i != req.params.id) {
//       plots.push(myObject.plots[i]);
//     }
//   }

//   myObject.plots = plots;

//   let newData = JSON.stringify(myObject, null, 2);

//   fs.writeFile('./data/db.json', newData, (err) => {
//     if (err) throw err;
//     res.status(201).send('Plot removed');
//   });
// });

function getUserById(userId) {
  let databaseRaw = fs.readFileSync('./data/db.json', 'utf8');
  let database = JSON.parse(databaseRaw);

  for (let i = 0; i < database.users.length; i++) {
    const user = database.users[i];
    if (user.id == userId) {
      return user;
    }
  }
}

module.exports = router;

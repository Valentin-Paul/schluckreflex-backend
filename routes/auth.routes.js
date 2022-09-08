// const express = require("express");
// const bcrypt = require('bcryptjs');
// const jwt = require("jsonwebtoken");

// const { isAuthenticated } = require("../middleware/jwt.middleware");
// const User = require("../models/User.model");

// const router = express.Router();
// const saltRounds = 10;
// let isAdmin = false

// // Create Account
// router.post('/signup', (req, res, next) => {
//   const {password, username, adminKey} = req.body;

//   // Check if email or password or name are provided as empty string 
//   if (password === '' || username === '') {
//     res.status(400).json({ message: "Provide password and name" });
//     return;
//   }

//   // Use regex to validate the email format
//   const usernameRegex = /^[a-zA-Z0-9_-]{6,15}$/;
//   if (!usernameRegex.test(username)) {
//     res.status(400).json({ message: 'Provide a valid email username. Only lowercase, uppercase letters and numbers are allowed'});
//     return;
//   }

//   if (adminKey === 'sichere_Nummer') {
//     isAdmin = true
//   }

//   // Use regex to validate the password format
//   const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
//   if (!passwordRegex.test(password)) {
//     res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
//     return;
//   }
//   // Check the users collection if a user with the same email already exists
//   User.findOne({ username })
//     .then((foundUser) => {
//       // If the user with the same email already exists, send an error response
//       if (foundUser) {
//         // If the user is not found, send an error response
//         const userError = new Error()
//         userError.name = 'usernameError'
//         throw userError
//       }

//       // If email is unique, proceed to hash the password
//       const salt = bcrypt.genSaltSync(saltRounds);
//       const hashedPassword = bcrypt.hashSync(password, salt);
//       // Create the new user in the database
//       // We return a pending promise, which allows us to chain another `then` 
//       return User.create(
//         {
//           username,
//           password: hashedPassword,
//           isAdmin
//         });
//     })
//     .then((createdUser) => {
//       // Deconstruct the newly created user object to omit the password
//       // We should never expose passwords publicly
//       const { email, _id, username } = createdUser;

//       // Create a new object that doesn't expose the password
//       const user = { email, _id, username };

//       // Send a json response containing the user object
//       res.status(201).json({ user: user });
//     })
//     .catch(err => {
//       console.log(err)
//       if (err.name === 'usernameError'){
//         res.status(401).json({message: "username already in use"})
//       } else {
//         res.status(500).json({ message: "The email you provided is already in use" })
//       }
//     });
// });


// // Login
// router.post('/login', (req, res, next) => {
//   const { username, password } = req.body;

//   // Check if username or password are provided as empty string 
//   if (username === '' || password === '') {
//     res.status(400).json({ message: "Provide username and password." });
//     return;
//   }

//   // Check the users collection if a user with the same username exists
//   User.findOne({ username })
//     .then((foundUser) => {

//       if (!foundUser) {
//         // If the user is not found, send an error response
//         const userError = new Error()
//         userError.name = 'usernameError'
//         throw userError
//       }

//       // Compare the provided password with the one saved in the database
//       const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

//       if (passwordCorrect) { // login was successful

//         // Deconstruct the user object to omit the password
//         const { _id, username } = foundUser;

//         // Create an object that will be set as the token payload
//         const payload = {
//           _id,
//           username
//         };

//         // Create and sign the token
//         const authToken = jwt.sign(
//           payload,
//           process.env.TOKEN_SECRET,
//           { algorithm: 'HS256', expiresIn: "6h" }
//         );

//         // Send the token as the response
//         res.json({ authToken: authToken });
//       }
//       else {
//         res.status(401).json({ message: "The email and password do not match, please try again" });
//       }

//     })
//     .catch(err => {
//       console.log(err)

//       if (err.name === 'usernameError'){
//         res.status(401).json({message: "Username not found"})
//       } else {
//         res.status(500).json({ message: "Internal Server Error" })
//       }
//     });
// });

// // Verify
// router.get('/verify', isAuthenticated, (req, res, next) => {

//   // If JWT token is valid the payload gets decoded by the
//   // isAuthenticated middleware and made available on `req.payload`
//   console.log("token is valid", req.payload);
//   console.log("req.payload...", req.payload);

//   // Send back the object with user data
//   // previously set as the token payload
//   res.status(200).json(req.payload);
// });


// /// Get all Users

// router.get('/users', isAuthenticated, (req, res, next)=>{
//   if (!req.payload.isAdmin){
//     notAdmin = new Error('notAdmin')
//     notAdmin.message = 'You are not authroised to perform this action'
//     res.status(401).json(notAdmin.message)
//     throw notAdmin
// }

//   User.find()
//     .then(response=>{res.json(response)})
//     .catch(err => {
//       res.status(404).json({
//           message: "You are unauthorised to view this page",
//           error: err
//       });
// })
// })



// module.exports = router;



const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

const router = express.Router();
const saltRounds = 10;
let isAdmin = false

// Create Account
router.post('/signup', (req, res, next) => {
  const { email, password, username, imageUrl, adminKey } = req.body;

  // Check if email or password or name are provided as empty string 
  if (email === '' || password === '' || username === '') {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide a valid email address.' });
    return;
  }

  if (adminKey === '7') {
    isAdmin = true
  }

  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }
  // Check the users collection if a user with the same email already exists
  User.findOne({ username })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        // If the user is not found, send an error response
        const userError = new Error()
        userError.name = 'usernameError'
        throw userError
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then` 
      return User.create(
        {
          username,
          email,
          password: hashedPassword,
          isAdmin,
          imageUrl
        });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, _id, username } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, _id, username };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch(err => {
      console.log(err)
      if (err.name === 'usernameError'){
        res.status(401).json({message: "username already in use"})
      } else {
        res.status(500).json({ message: "The email you provided is already in use" })
      }
    });
});


// Login
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  // Check if username or password are provided as empty string 
  if (username === '' || password === '') {
    res.status(400).json({ message: "Provide username and password." });
    return;
  }

  // Check the users collection if a user with the same username exists
  User.findOne({ username })
    .then((foundUser) => {

      if (!foundUser) {
        // If the user is not found, send an error response
        const userError = new Error()
        userError.name = 'usernameError'
        throw userError
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) { // login was successful

        // Deconstruct the user object to omit the password
        const { _id, username, isAdmin, imageUrl, dogs } = foundUser;

        // Create an object that will be set as the token payload
        const payload = {
          _id,
          username,
          isAdmin,
          imageUrl,
          dogs
        };

        // Create and sign the token
        const authToken = jwt.sign(
          payload,
          process.env.TOKEN_SECRET,
          { algorithm: 'HS256', expiresIn: "6h" }
        );

        // Send the token as the response
        res.json({ authToken: authToken });
      }
      else {
        res.status(401).json({ message: "The email and password do not match, please try again" });
      }

    })
    .catch(err => {
      console.log(err)

      console.log(err)

      if (err.name === 'usernameError'){
        res.status(401).json({message: "Username not found"})
      } else {
        res.status(500).json({ message: "Internal Server Error" })
      }
    });
});

// Verify
router.get('/verify', isAuthenticated, (req, res, next) => {

  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log("token is valid", req.payload);
  console.log("req.payload...", req.payload);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});


/// Get all Users

router.get('/users', isAuthenticated, (req, res, next)=>{
  if (!req.payload.isAdmin){
    notAdmin = new Error('notAdmin')
    notAdmin.message = 'You are not authroised to perform this action'
    res.status(401).json(notAdmin.message)
    throw notAdmin
}

  User.find()
    .then(response=>{res.json(response)})
    .catch(err => {
      res.status(404).json({
          message: "You are unauthorised to view this page",
          error: err
      });
})
})


// Add dogs

router.put('/user/:userId/add-dog', (req, res, next) => {
  console.log(req.body)
  let newDog = {
    name: req.body.name,
    breed: req.body.breed,
    imageUrl: req.body.imageUrl
  }

  if (newDog.imageUrl === '') {
    newDog = {
      name: req.body.name,
      breed: req.body.breed,
    }
  }

  console.log(newDog)

  User.findByIdAndUpdate(req.params.userId, { $push: { dogs: newDog } })
    .populate("dogs")
    .then((response) => {
      res.json(response)
    })
    .catch()
})

router.get('/user/:userId', (req, res, next) => {
  User.findById(req.params.userId)
    .populate("dogs")
    .populate('eventsAttending')
    .then(response => {
      res.json(response)
    })
    .catch(err => {
      res.status(500).json({
        message: 'error getting dogs',
        error: err
      })
    })
})

router.get('/user/:userId/delete-dog', (req, res, next) => {
  console.log(req.params.userId)
  User.findById(req.params.userId)
    .then(response => { res.json(response) })
    .catch(err => {
      res.status(500).json({
        message: 'error deleting dog',
        error: err
      })
    })
})

router.put('/user/:userId', (req, res, next) => {
  User.findByIdAndUpdate(req.body._id, req.body)
    .then(response => { res.json(response) })
    .catch(err => {
      res.status(500).json({
        message: 'error deleting dog',
        error: err
      })
    })
})


router.put('/user/:userId/add-dogcare', isAuthenticated, (req, res, next) => {
  console.log(req.body)
  let newDogcare = {
    name: req.body.name,
    from: req.body.from,
    to: req.body.to,
    calendar: req.body.calendar,
    repeat: 0,
    owner: req.body.owner,
    dogs: req.body.dogs
  }

 

  User.findByIdAndUpdate(req.params.userId, { $push: { dogcare: newDogcare } })
  .populate("dogcare")
  .then((response) => {
    res.json(response)
  })
  .catch()
})


router.put('/user/:userId/delete-dogcare', isAuthenticated, (req, res, next) =>{
    
})

module.exports = router;

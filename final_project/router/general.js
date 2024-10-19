const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

    // Create a new Promise
    new Promise((resolve, reject) => {
      resolve(books);
  })
  .then(data => {
      // Send the resolved data as a JSON response
      res.status(200).json(data);
  })
  .catch(error => {
      // Handle any potential errors
      res.status(500).json({ message: "Error retrieving books", error });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;

    // Create a new Promise
    new Promise((resolve, reject) => {
      resolve(books[ISBN]);
  })
  .then(data => {
      // Send the resolved data as a JSON response
      res.send(data);
  })
  .catch(error => {
      // Handle any potential errors
      res.status(500).json({ message: "Error retrieving books", error });
  });

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;


  new Promise((resolve, reject) => {
    
    for (let key in books) {
      if (books.hasOwnProperty(key) && books[key].author == author) {
        resolve(books[key]);
        break;
      }
    }
    
  })
  .then(data => {
      // Send the resolved data as a JSON response
      res.send(data);
  })
  .catch(error => {
      // Handle any potential errors
      res.status(500).json({ message: "Error retrieving books", error });
  });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;


  new Promise((resolve, reject) => {
    
    for (let key in books) {
      if (books.hasOwnProperty(key) && books[key].title == title) {
        resolve(books[key]);
        break;
      }
    }
    
  })
  .then(data => {
      // Send the resolved data as a JSON response
      res.send(data);
  })
  .catch(error => {
      // Handle any potential errors
      res.status(500).json({ message: "Error retrieving books", error });
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    for (let key in books) {
      if (books.hasOwnProperty(key) && key == isbn) {
        res.send(books[key].reviews)
        break;
      }
    }
});

module.exports.general = public_users;

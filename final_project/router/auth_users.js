const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean

    // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }

}

//only registered users can login
regd_users.post("/login", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  console.log("Check");

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password, username
      }, 'access', { expiresIn: 60});

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const accessToken = req.session.authorization?.accessToken;

  if (accessToken) {  // Check if user is logged in
      const isbn = req.params.isbn;
      let review = req.query.review
      let book = books[isbn];

      if (!book) {
        // If the book does not exist in the 'books' object
        return res.status(404).send("Book not found");
      }
  
      if (review) {
        // Update the review if it is provided
        book.review = review;
        res.send(`Review for ISBN ${isbn} has been updated to: ${review}.`);
      } else {
        res.status(400).send("No review provided");
      }
  } else {
      // Respond if friend with specified email is not found
      res.send("User is not logged in");
      }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const accessToken = req.session.authorization?.accessToken;

  if (!accessToken) {  // Check if the user is logged in
      return res.status(401).send("User is not logged in");
  }

  const isbn = req.params.isbn;
  let book = books[isbn];

  if (!book) {
      // If the book does not exist in the 'books' object
      return res.status(404).send("Book not found");
  }

  // Check if the review exists for the book
  if (!book.review) {
      return res.status(404).send("No review found for this book");
  }

  // Delete the review
  delete book.review;
  res.status(200).send("Review deleted successfully");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

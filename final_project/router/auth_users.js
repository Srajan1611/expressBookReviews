const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username: username }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({message: "Customer successfully logged in"});
  }
  
  return res.status(401).json({message: "Invalid username or password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.session.authorization?.username;
  
  if (!username) {
    return res.status(401).json({message: "User not logged in"});
  }
  
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  
  if (!review) {
    return res.status(400).json({message: "Review content is required"});
  }
  
  book.reviews[username] = review;
  return res.status(200).json({message: "Review added successfully"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;
  
  if (!username) {
    return res.status(401).json({message: "User not logged in"});
  }
  
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  
  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
  }
  
  return res.status(404).json({message: "Review not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

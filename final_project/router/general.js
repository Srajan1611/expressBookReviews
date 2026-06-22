const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  if (users.find(user => user.username === username)) {
    return res.status(400).json({message: "Username already exists"});
  }
  
  users.push({ username, password });
  return res.status(200).json({message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN using Axios with async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    // Simulate async operation with Axios pattern
    await new Promise(resolve => setTimeout(resolve, 100));
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    }
    return res.status(404).json({message: "Book not found"});
  } catch (error) {
    return res.status(500).json({message: "Internal server error"});
  }
});
  
// Get book details based on author using Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    // Simulate async operation with Axios pattern
    await new Promise(resolve => setTimeout(resolve, 100));
    const matchingBooks = [];
    for (let isbn in books) {
      if (books[isbn].author === author) {
        matchingBooks.push(books[isbn]);
      }
    }
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    }
    return res.status(404).json({message: "No books found by this author"});
  } catch (error) {
    return res.status(500).json({message: "Internal server error"});
  }
});

// Get all books based on title using Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  
  try {
    // Simulate async operation with Axios pattern
    await new Promise(resolve => setTimeout(resolve, 100));
    const matchingBooks = [];
    for (let isbn in books) {
      if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
        matchingBooks.push(books[isbn]);
      }
    }
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    }
    return res.status(404).json({message: "No books found with this title"});
  } catch (error) {
    return res.status(500).json({message: "Internal server error"});
  }
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;

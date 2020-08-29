const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Book  = require('./books.model');
const Port = 3000;

mongoose.connect(process.env.DB_CONFIG);

let db = mongoose.connection;

//check if database connected
db.once('open', ()=>{
    console.log('connected to db');
})

//check if error connecting to db
 db.on('error', ()=>{
     console.log('failed in connecting to db');
 })

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:false}));

app.all('*', verifyToken);


app.post('/auth', (req, res, next)=>{
  let data = req.body;
  if(Object.keys(data).length === 0 && data.constructor === Object){
    res.status(400).send('credential missing');
  }
  let token = jwt.sign(data, process.env.SECRET);
  res.status(200).send(token);
})

function verifyToken(req, res, next){
     //no authentication required for /auth
    if(req.path == '/auth') return next();
    //else
    let authHead = req.headers['authorization'];
    let token = authHead && authHead.split(' ')[1];
    if(token === null) return res.status(403).send('forbidden');

    jwt.verify(token, process.env.SECRET, (err, data)=>{
      if(err) return res.sendStatus(403);
      req.data = data;
      next();
    })
}


//get all books

app.get('/books', (req, res)=>{
    Book.find({}).exec((err, result)=>{
      if(err) console.error(err);
      res.status(200).send(result);
    });
})

//create a new book

app.post('/books', (req, res)=>{
    let newBook = new Book;

    newBook.title = req.body.title;
    newBook.pages = req.body.pages;
    newBook.author= req.body.author;

    newBook.save((err, book)=>{
        if(err) console.log(err);
        res.status(200).send(book);
    })
})

//get a book by id

app.get('/books/:id', function(req, res) {
    console.log('getting all books');
    Book.findOne({
      _id: req.params.id
      })
      .exec(function(err, books) {
        if(err) {
          res.status(404).send('Not Found');
        } else {
          res.status(200).send(books);
        }
      });
  });
  
 //update a book by id
 
 app.put('/books/:id', function(req, res) {
    Book.findOneAndUpdate({
      _id: req.params.id
      },
      { $set: { title: req.body.title }
    }, {upsert: true}, function(err, newBook) {
      if (err) {
        res.status(400).send('error updating ');
      } else {
        res.status(200).send(newBook);
      }
    });
  });

  //delete a book

  app.delete('/books/:id', function(req, res) {
    Book.findOneAndRemove({
      _id: req.params.id
    }, function(err, book) {
      if(err) {
        res.status(400).send('error removing')
      } else {
        res.status(200).send('success');
      }
    });
  });

app.listen(3000, ()=>{console.log(`app started at ${Port}`)});

module.exports = app;
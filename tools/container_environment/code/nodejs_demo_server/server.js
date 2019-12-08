// Demo Node.js Server.

// Imports
const express = require('express');

const cors = require('cors');

const morgan = require('morgan');

const debug = require('debug')('http');

// Create the app.
const app = express();

// Setup Middleware.
app.use(cors());
app.use(morgan('dev'));

// Routes
app.get('/hello', (req, res) => {
  res.send('Hello World');
});

// Start the service.
const port = process.env.PORT || '7001';

app.listen(
  port,
  () => console.log(`API Server Listening on Port ${port}`),
);

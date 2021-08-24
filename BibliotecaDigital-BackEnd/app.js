'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var userRoutes = require('./routes/user.route');
var librosRoutes = require('./routes/libros.routes');
var reservacionRoutes = require('./routes/reservacion.routes');


var cors = require('cors');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', userRoutes);
app.use('/api', librosRoutes);
app.use('/api', reservacionRoutes);

module.exports = app;
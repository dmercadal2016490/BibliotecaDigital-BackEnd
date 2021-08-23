'use strict'

var express = require('express');
var librosController = require('../controller/libors.controller');
var connectMultiparty = require('connect-multiparty');
var mdAuth = require('../middlewares/authenticated');
const upload = connectMultiparty({uploadDir: './uploads/books'});

var api = express.Router();

module.exports = api; 

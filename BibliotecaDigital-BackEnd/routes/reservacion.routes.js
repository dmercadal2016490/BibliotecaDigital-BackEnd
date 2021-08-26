'use strict'

var express = require('express');
var reservacionController = require('../controller/reservacion.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.put('/:idU/reservar/:idL', mdAuth.ensureAuth, reservacionController.reservar);
api.put('/:idU/devolver/:idL', mdAuth.ensureAuth, reservacionController.devolver);

module.exports = api; 

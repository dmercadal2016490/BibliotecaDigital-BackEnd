'use strict'

var express = require('express');
var reportesController = require('../controller/reportes.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/usuarioMasReservas', reportesController.usuarioMasReservas);
api.get('/libroMasRentado', reportesController.libroMasRentado);
api.get('/RevistaMasRentada', reportesController.RevistaMasRentada);
api.get('/librosAgotados', reportesController.librosAgotados);

module.exports = api;
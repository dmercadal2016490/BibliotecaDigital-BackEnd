'use strict'

var express = require('express');
var reportesController = require('../controller/reportes.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/usuarioMasReservas', reportesController.usuarioMasReservas);
api.get('/usuarioMenosReservas', reportesController.usuarioMenosReservas);
api.get('/libroMasRentado', reportesController.libroMasRentado);
api.get('/libroMenosRentado', reportesController.libroMenosRentado);
api.get('/RevistaMasRentada', reportesController.RevistaMasRentada);
api.get('/RevistaMenosRentada', reportesController.RevistaMenosRentada);
api.get('/librosAgotados', reportesController.librosAgotados);

module.exports = api;
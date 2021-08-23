'use strict'

var Libro = require('../models/libros.model');
var fs = require('fs');
var path = require('path');
var jwt = require('../services/jwt');

function addLibro(req, res){
    var libro = new Libro();
    var userId = req.params.idU;
}

module.exports = {
    addLibro
}
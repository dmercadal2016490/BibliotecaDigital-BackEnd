'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var librosSchema = Schema({
    bibliografia: String,
    titulo: String,
    autor: String,
    descripcion: String,
    edicion: String,
    palabrasClaves: String,
    temas: String,
    frecuencia: String,
    ejemplares: Number,
    image: String,
    copias: Number,
    disponibles: Number,
    compras: Number,
    busquedas: Number
});

module.exports = mongoose.model('libros', librosSchema)
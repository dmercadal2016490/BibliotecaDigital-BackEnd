'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    cui: String,
    name: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    role: String,
    image: String,
    librosRentados: Number,
    Libros: [{type: Schema.ObjectId, ref:'libros'}]
})

module.exports = mongoose.model('user', userSchema)
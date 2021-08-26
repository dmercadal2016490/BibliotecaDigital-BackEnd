'use strict'

var User = require ('../models/user.model');
var Libro = require('../models/libros.model');

function usuarioMasReservas (req,res){
    User.find((err, userFind)=>{
        if(err){
            res.status(500).send({message: 'Error general al buscar a los usuarios'});
            console.log(err);
        }else if(userFind){
            res.send({message: 'Usuarios encontrados: ', userFind});
        }else{
            res.status(404).send({message: 'No hay usuarios'});
        }
    }).sort({librosRentados:-1});
}

function libroMasRentado(req,res){
    Libro.find({bibliografia:'Libro'}, (err, libroFound)=>{
        if(err){
            res.status(500).send({message: 'Error general al buscar los libros'});
            console.log(err);
        }else if(libroFound){
            res.send({message: 'Libros encontrados: ', libroFound})
        }else{
            res.status(404).send({message: 'No hay libros mas rentados'});
        }
    }).sort({compras:-1})
}

function RevistaMasRentada(req,res){
    Libro.find({bibliografia:'Revista'}, (err, revistaFound)=>{
        if(err){
            res.status(500).send({message: 'Error general al buscar las revistas'});
            console.log(err);
        }else if(revistaFound){
            res.send({message: 'Revistas encontradas: ', revistaFound})
        }else{
            res.status(404).send({message: 'No hay revistas mas rentadas'});
        }
    }).sort({compras:-1})
}

function librosAgotados(req,res){
    Libro.find({disponibles:0}, (err,found)=>{
        if(err){
            res.status(500).send({message: 'Error general al buscar los agotados'});
            console.log(err);
        }else if(found){
            res.send({message: 'Productos agotados: ', found});
        }else{
            res.status(404).send({message: 'No hay revistas ni libros agotados'});
        }
    })
}

module.exports = {
    usuarioMasReservas,
    libroMasRentado,
    RevistaMasRentada,
    librosAgotados
}
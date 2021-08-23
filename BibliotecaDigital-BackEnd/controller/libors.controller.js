'use strict'

var Libro = require('../models/libros.model');
var fs = require('fs');
var path = require('path');
var jwt = require('../services/jwt');
const { update } = require('../models/libros.model');

function addLibro(req, res){
    var libro = new Libro();
    var userId = req.params.idU;
    var params = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para acceder a esta ruta'})
    }else{
        if(params.bibliografia && params.titulo && params.autor && params.descripcion && params.palabrasClave && params.temas && params.copias){
            Libro.findOne({titulo: params.titulo.toLowerCase()}, (err, libroFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general al buscar el libro'});
                    console.log(err);
                }else if(libroFind){
                    res.send({message: 'El libro que quieres ingresar ya existe'});
                }else{
                    libro.bibliografia = params.bibliografia;
                    libro.titulo = params.titulo;
                    libro.autor = params.autor;
                    libro.descripcion = params.descripcion;
                    libro.palabrasClaves = params.palabrasClave;
                    libro.temas = params.temas;
                    libro.copias = params.copias;
                    libro.disponibles = 0;
                    libro.compras = 0;
                    if(params.bibliografia == 'Libro'){
                        libro.frecuencia = 'Publicacion Unica';
                        libro.ejemplares = 1;

                        libro.save((err, libroSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Error general al crear el libro'});
                                console.log(err);
                            }else if(libroSaved){
                                res.send({message: 'Libro guardado ', libroSaved});
                            }else{
                                res.send({message: 'No se guardo el libro'});
                            }
                        })
                    }else{
                        libro.frecuencia = params.frecuencia;
                        libro.ejemplares = params.ejemplares;

                        libro.save((err, libroSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Error general al crear el libro'});
                                console.log(err);
                            }else if(libroSaved){
                                res.send({message: 'Libro guardado ', libroSaved});
                            }else{
                                res.send({message: 'No se guardo el libro'});
                            }
                        })
                    }
                }
            })
        }else{
            res.send({message: 'Favor de ingresar todos los campos'});
        }
    }
}

function agregarCopias(req,res){
    var userId = req.params.idU;
    var libroId = req.params.idL;
    var params = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para acceder a esta ruta'})
    }else{
        Libro.findById(libroId, (err, libroFind)=>{
            if(err){
                res.status(500).send({message: 'Error general al buscar el libro'});
                console.log(err);
            }else if(libroFind){
                Libro.findByIdAndUpdate(libroId, {$inc:{disponibles: +params.cantidad}}, {new:true}, (err, agregado)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al agregar las copias'});
                        console.log(err);
                    }else if(agregado){
                        res.send({message: 'Copias agregadas ', agregado});
                    }else{
                        res.send({message: 'No se agregaron las copias'});
                    }
                })
            }else{
                res.status(404).send({message: 'El libro al que quieres agregar las copias no existe'});
            }
        })
    }
}

function quitarCopias(req,res){
    var userId = req.params.idU;
    var libroId = req.params.idL;
    var params = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para acceder a esta ruta'})
    }else{
        Libro.findById(libroId, (err, libroFind)=>{
            if(err){
                res.status(500).send({message: 'Error general al buscar el libro'});
                console.log(err);
            }else if(libroFind){
                Libro.findByIdAndUpdate(libroId, {$inc:{disponibles: -params.cantidad}}, {new:true}, (err, quitado)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al quitar las copias'});
                        console.log(err);
                    }else if(quitado){
                        res.send({message: 'Copias quitadas ', quitado});
                    }else{
                        res.send({message: 'No se quitaron las copias'});
                    }
                })
            }else{
                res.status(404).send({message: 'El libro al que quieres agregar las copias no existe'});
            }
        })
    }
}

function updateLibro(req, res){
    var userId = req.params.idU;
    var libroId = req.params.idL;
    var params = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para acceder a esta ruta'})
    }else{
        if(params.disponibles || params.compras){
            res.status(401).send({message: 'No se puede actulizar las copias ni las compras de un libro'});
        }else{
            Libro.findById(libroId, (err,libroFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general al buscar el libro'});
                    console.log(err);
                }else if(libroFind){
                    Libro.findByIdAndUpdate(libroId, params, {new:true}, (err, libroUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error general al actualizar el libro'});
                            console.log(err);
                        }else if(libroUpdated){
                            res.send({message: 'Libro actualizado ', libroUpdated});
                        }else{
                            res.send({message: 'No se actualizo el libro'});
                        }
                    })
                }else{
                    res.status(404).send({message: 'El libro que quieres actualizar no existe'});
                }
            })
        }
    }
}

function deleteLibro(req,res){
    var userId = req.params.idU;
    var libroId = req.params.idL;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para acceder a esta ruta'})
    }else{
        Libro.findById(libroId, (err,libroFind)=>{
            if(err){
                res.status(500).send({message: 'Error general al buscar el libro'});
                console.log(err);
            }else if(libroFind){
                Libro.findByIdAndRemove(libroId, (err, libroDeleted)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al eliminar el libro'});
                    }else if(libroDeleted){
                        res.send({message: 'Libro eliminado'})
                    }else{
                        res.send({message: 'No se elimino el libro'});
                    }
                })
            }else{
                res.status(404).send({message: 'El libro que quieres eliminar no existe'});
            }
        })
    }
}

function getLibros(req,res){
    Libro.find({}).exec((err, libros)=>{
        if(err){
            res.status(500).send({message: 'Error general al buscar usuarios'});
            console.log(err)
        }else if(libros){
            res.send({message: 'Libros encontrados: ', libros});
        }else{
            res.status(404).send({message: 'No existen libros'})
        }
    })
}

module.exports = {
    addLibro,
    agregarCopias,
    quitarCopias,
    updateLibro,
    deleteLibro,
    getLibros
}
'use strict'

var User = require('../models/user.model');
var Libro = require('../models/libros.model');

function reservar(req,res){
    var userId = req.params.idU;
    var libroId = req.params.idL;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para reservar un libro'});
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general al buscar al usuario'});
                console.log(err);
            }else if(userFind){
                if(userFind.librosRentados >= 10){
                    res.send({message: 'No puedes rentar mas de 10 libros'})
                }else{
                    Libro.findById(libroId, (err,libroFind)=>{
                        if(err){
                            res.status(500).send({message: 'Error general al buscar el libro'});
                            console.log(err);
                        }else if(libroFind){
                            if(libroFind.disponibles <= 0){
                                res.send({message: 'No hay copias de los libros para reservar'});
                            }else{
                                Libro.findByIdAndUpdate(libroId, {$inc:{compras: +1}}, {new:true}, (err, libroPushed)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general al alterar datos de libro'});
                                        console.log(err);
                                    }else if(libroPushed){
                                        Libro.findByIdAndUpdate(libroId, {$inc:{disponibles:-1}}, {new:true}, (err,menos)=>{
                                            if(err){
                                                res.status(500).send({message:'Eror general'});
                                                console.log(err);
                                            }else if(menos){
                                                User.findByIdAndUpdate(userId, {$push:{Libros: libroPushed._id}}, {new:true}, (err, userPushed)=>{
                                                    if(err){
                                                        res.status(500).send({message: 'Error general al agregar el libro al usuario'});
                                                        console.log(err);
                                                    }else if(userPushed){
                                                        User.findByIdAndUpdate(userId, {$inc:{librosRentados: +1}}, {new:true}, (err, aumento)=>{
                                                            if(err){
                                                                res.status(500).send({message: 'Error general al aumentar las reservaciones del usuario'});
                                                                console.log(err);
                                                            }else if(aumento){
                                                                User.findByIdAndUpdate(userId, {$push:{Historial: libroPushed._id}}, {new:true}, (err, pushed)=>{
                                                                    if(err){
                                                                        res.status(500).send({message:'Error general al generar el historial'});
                                                                        console.log(err);
                                                                    }else if(pushed){
                                                                        res.send({message: 'Libro reservado con exito ', pushed})
                                                                    }else{
                                                                        res.send({message: 'No se genero historial'})
                                                                    }
                                                                })
                                                            }else{
                                                                res.send({message: 'No se reservo'});
                                                            }
                                                        })
                                                    }else{
                                                        res.send({message:'No se agrego el libro al usuario'})
                                                    }
                                                })
                                            }else{
                                                res.send({message: 'No'})
                                            }
                                        })
                                    }else{
                                        res.send({message: 'Error con libro'});
                                    }
                                })
                            }
                        }else{
                            res.status(404).send({message: 'El libro que quieres reservar no existe'});
                        }
                    })
                }
            }else{
                res.status(404).send({message: 'No se encontro al usuario'});
            }
        })
    }
}

function devolver(req,res){
    var userId = req.params.idU;
    var libroId = req.params.idL;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para reservar un libro'});
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general al buscar al usuario'});
                console.log(err);
            }else if(userFind){
                Libro.findById(libroId, (err, libroFind)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al buscar el libro'});
                        console.log(err);
                    }else if(libroFind){
                        Libro.findByIdAndUpdate(libroId, {$inc:{disponibles: +1}}, {new:true}, (err, libroPushed)=>{
                            if(err){
                                res.status(500).send({message: 'Error general al actualizar el libro'});
                                console.log(err);
                            }else if(libroPushed){
                                User.findOneAndUpdate({_id: userId, Libros: libroId}, {$pull:{Libros: libroId}}, {new:true}, (err, userPulled)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general al devolver el libro'});
                                        console.log(err);
                                    }else if(userPulled){
                                        User.findByIdAndUpdate(userId, {$inc:{librosRentados: -1}}, {new:true}, (err, devuelto)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error general al actualizar al usuario'});
                                                console.log(err);
                                            }else if(devuelto){
                                                res.send({message: 'Libro devuelto con exito ', devuelto});
                                            }else{
                                                res.send({message: 'No se actualizo el usuario'});
                                            }
                                        })
                                    }else{
                                        res.send({message: 'No se devolvio el libro'});
                                    }
                                })
                            }else{
                                res.status(401).send({message: 'No se actualizo el libro'});
                            }
                        })
                    }else{
                        res.status(404).send({message: 'El libro que quieres devolver no existe'});
                    }
                })
            }else{
                res.status(404).send({message: 'No se encontro al usuario'});
            }
        })
    }
}

module.exports = {
    reservar,
    devolver
}
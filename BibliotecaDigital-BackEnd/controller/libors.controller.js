'use strict'

var Libro = require('../models/libros.model');
var User = require('../models/user.model');
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
        if(params.bibliografia && params.titulo && params.autor && params.descripcion && params.palabrasClaves && params.temas && params.copias){
            Libro.findOne({titulo: params.titulo.toLowerCase()}, (err, libroFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general al buscar el libro'});
                    console.log(err);
                }else if(libroFind){
                    res.send({message: 'El libro que quieres ingresar ya existe'});
                }else{
                    libro.bibliografia = params.bibliografia;
                    libro.titulo = params.titulo.toLowerCase();
                    libro.autor = params.autor;
                    libro.descripcion = params.descripcion;
                    libro.palabrasClaves = params.palabrasClaves;
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
                Libro.findByIdAndUpdate(libroId, {$inc:{disponibles: +params.disponibles}}, {new:true}, (err, agregado)=>{
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
                if(libroFind.disponibles <=0){
                    res.send({message: 'No hay copias para quitar'})
                }else{
                    Libro.findByIdAndUpdate(libroId, {$inc:{disponibles: -params.disponibles}}, {new:true}, (err, quitado)=>{
                        if(err){
                            res.status(500).send({message: 'Error general al quitar las copias'});
                            console.log(err);
                        }else if(quitado){
                            res.send({message: 'Copias quitadas ', quitado});
                        }else{
                            res.send({message: 'No se quitaron las copias'});
                        }
                    })
                }
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

function deleteLibro(req,res){
    var userId = req.params.idU;
    var libroId = req.params.idL;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para acceder a esta ruta'})
    }else{
        User.findOne({Libros: libroId}, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general al buscar el usuario'});
                console.log(err);
            }else if(userFind){
                res.send({message: 'Un usuario tiene una copia de este libro. Espera que lo devuelva primero'});
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

function uploadImageLibro(req, res){
    var libroId = req.params.idL;
    var userId = req.params.idU;
    var update = req.body;
    var fileName;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para cambiar la foto de un Libro'});
    }else{
        if(req.files){
            var filePath = req.files.image.path;
        
            var fileSplit = filePath.split('\\');
            var fileName = fileSplit[2];

            var extension = fileName.split('\.');
            var fileExt = extension[1];
            if( fileExt == 'png' ||
                fileExt == 'PNG' ||
                fileExt == 'jpg' ||
                fileExt == 'jpeg' ||
                fileExt == 'gif'){
                    Libro.findByIdAndUpdate(libroId, {image: fileName}, {new:true}, (err, libroUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error general'});
                        }else if(libroUpdated){
                            res.send({libro: libroUpdated, libroImage:libroUpdated.image});
                        }else{
                            res.status(400).send({message: 'No se ha podido actualizar'});
                        }
                    })
                }else{
                    fs.unlink(filePath, (err)=>{
                        if(err){
                            res.status(500).send({message: 'Extensión no válida y error al eliminar archivo'});
                        }else{
                            res.send({message: 'Extensión no válida'})
                        }
                    })
                }
        }else{
            res.status(400).send({message: 'No has enviado imagen a subir'})
        }
    }
}

function getImageLibro(req,res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/books/' + fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}

function getMylibros(req,res){
    var userId = req.params.idU;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para ver libros rentados de otro'});
    }else{
    User.findById(userId).populate({path:'Libros', populate:{path:'Libros'}}).exec((err,libros)=>{
        if(err){
            res.status(500).send({message:'Error general'});
            console.log(err);
        }else if(libros){
            res.send({message: 'Libros: ', libros});
        }else{
            res.status(404).send({message: 'No tienes libros rentados'});
        }
    })
    }
}

function getHistorial(req,res){
    var userId = req.params.idU;
    User.findById(userId).populate({path:'Historial', populate:{path:'Historial'}}).exec((err,historial)=>{
        if(err){
            res.status(500).send({message:'Error general'});
            console.log(err);
        }else if(historial){
            res.send({message: 'Historial: ', historial});
        }else{
            res.status(404).send({message: 'No tienes historial'});
        }
    })
}

function limpiarHistorial(req,res){
    var userId = req.params.idU;

    User.findByIdAndUpdate(userId, {$pullAll:{Historial}}, (err, erased)=>{
        if(err){
            res.status(500).send({message: 'Error general al eliminar el historia'});
            console.log(err);
        }else if(erased){
            res.send({message: 'Historial eliminado'});
        }else{
            res.send({message: 'No se borro el historial'})
        }
    })
}

function search(req,res){
    var params = req.body;

    if(params.search){
        Libro.find({$or:[{bibliografia: params.search},
                        {titulo: params.search},
                        {autor: params.search},
                        {palabrasClaves: params.search},
                        {temas: params.search},
                        {frecuencia: params.search},
                        ]}, (err, searched)=>{
                            if(err){
                                res.status(500).send({message: 'Error general al buscar el libro'});
                                console.log(err);
                            }else if(searched){
                                Libro.findOneAndUpdate({$or:[{bibliografia: params.search},
                                    {titulo: params.search},
                                    {autor: params.search},
                                    {palabrasClaves: params.search},
                                    {temas: params.search},
                                    {frecuencia: params.search},
                                    ]}, {$inc: {busquedas: +1}}, {new:true}, (err, libroSerached)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error general'});
                                            console.log(err);
                                        }else if(libroSerached){
                                            res.send({message: 'Libro encontrado: ', libroSerached})
                                        }else{
                                            res.send({message: 'No se actualizo'})
                                        }
                                    })
                            }else{
                                res.status(404).send({message: 'No existe ningun libro con estas caracteristicas'})
                            }
                        })
    }else{
        res.status(401).send({message: 'Porfavor ingrese un dato en el campo de busqueda'});
    }
}

module.exports = {
    addLibro,
    agregarCopias,
    quitarCopias,
    updateLibro,
    deleteLibro,
    getLibros,
    uploadImageLibro,
    getImageLibro,
    getMylibros,
    search,
    getHistorial,
    limpiarHistorial
}
'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
var jwt = require('../services/jwt');


function createInit(req,res){
    let user = new User();

    User.findOne({username:'adminpractica'}, (err, userFound)=>{
        if(err){
            console.log('Error al crear al usuario', err)
        }else if(userFound){
            console.log('Usuario administrador ya creado');
        }else{
            user.password = 'adminpractica'
            bcrypt.hash(user.password, null,null, (err, passwordHashed)=>{
                if(err){
                    console.log('Error general al encriptar la contraseña', err);
                }else if(passwordHashed){
                    user.password = passwordHashed;
                    user.username = 'adminpractica';
                    user.role = 'ROLE_ADMIN';
                    user.name = 'admin';
                    user.lastname = 'admin';
                    user.cui = '0000 00000 0000';
                    user.email = 'admin@gmail.com';
                    user.librosRentados = 0;

                    user.save((err,userSaved)=>{
                        if(err){
                            console.log('Error general al crear el usuario administrador', err);
                        }else if(userSaved){
                            console.log('Usuario administrador creado con exito', userSaved);
                        }else{
                            console.log('No se creo al usuario administrador');
                        }
                    })

                }else{
                    console.log('No se encripto la contraseña');
                }
            })
        }
    })
}


function login(req,res){
    var params = req.body;

    if(params.username && params.password){
        User.findOne({username: params.username.toLowerCase()}, (err,userFind)=>{
            if(err){
                res.status(500).send('Error general al buscar el usuario');
                console.log(err);
            }else if(userFind){
                bcrypt.compare(params.password,userFind.password, (err,checkPassword)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al verificar la contraseña'});
                        console.log(err);
                    }else if(checkPassword){
                        if(params.gettoken){
                            delete userFind.password;
                            return res.send({ token: jwt.createToken(userFind), user: userFind});
                        }else{
                            res.send({message: 'Usuario logeado'});
                        }
                    }else{
                        res.status(400).send({message: 'Contraseña incorrecta'});
                    }
                })
            }else{
                res.status(404).send({message: 'El usuario con el que intentas ingresar no existe. Comunicate con el administrador'});
            }
        }).populate('Libros').populate('Historial')
    }else{
        res.status(401).send({message: 'Por favor ingresa tu username y contraseña'});
    }
}

/*function register(req,res){
    var params = req.body;
    var user = new User();

    if(params.username && params.password && params.name && params.lastname && params.email && params.cui){
        User.findOne({username: params.username}, (err,userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general al buscar el username'});
                console.log(err);
            }else if(userFind){
                res.send({message: 'Nombre de Usuario ya en uso'});
            }else{
                User.findOne({cui: params.cui}, (err,cuiFound)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al buscar el CUI'});
                        console.log(err);
                    }else if(cuiFound){
                        res.send({message: 'Numero de cui ya en uso, perteneciente al usuario: ', Usuario: cuiFound.username});
                    }else{
                        bcrypt.hash(params.password, null, null, (err, passwordHashed)=>{
                            if(err){
                                res.status(500).send({message: 'Error general al encriptar la contraseña'});
                                console.log(err);
                            }else if(passwordHashed){
                                user.cui = params.cui
                                user.password = passwordHashed;
                                user.name = params.name;
                                user.lastname = params.lastname;
                                user.username = params.username.toLowerCase();
                                user.email = params.email.toLowerCase();
                                user.role = 'ROLE_USER';

                                user.save((err, userSaved)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general al crear al usuario'});
                                        console.log(err);
                                    }else if(userSaved){
                                        res.send({message: 'Usuario creado exitosamente ', userSaved})
                                    }else{
                                        res.status(400).send({message: 'No se creo al usuario'})
                                    }
                                })
                            }else{
                                res.status(400).send({message: 'Contraseña no encriptada'});
                            }
                        })
                    }
                })
            }
        })
    }else{
        res.send({message: 'Favor de ingresar todos los campos'});
    }
}*/

function saveUser(req,res){
    var params = req.body;
    var user = new User();
    var userId = req.params.idU;
    var emailV = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para acceder a esta ruta'})
    }else{
        if(params.username && params.password && params.name && params.lastname && params.email && params.cui && params.role){
            if(emailV.test(params.email)){
                User.findOne({username: params.username.toLowerCase()}, (err,userFind)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al buscar el username'});
                        console.log(err);
                    }else if(userFind){
                        res.send({message: 'Nombre de Usuario ya en uso'});
                    }else{
                        User.findOne({cui: params.cui}, (err,cuiFound)=>{
                            if(err){
                                res.status(500).send({message: 'Error general al buscar el CUI'});
                                console.log(err);
                            }else if(cuiFound){
                                res.send({message: 'Numero de cui ya en uso, perteneciente al usuario: ', Usuario: cuiFound.username});
                            }else{
                                bcrypt.hash(params.password, null, null, (err, passwordHashed)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general al encriptar la contraseña'});
                                        console.log(err);
                                    }else if(passwordHashed){
                                        user.cui = params.cui
                                        user.password = passwordHashed;
                                        user.name = params.name;
                                        user.lastname = params.lastname;
                                        user.username = params.username.toLowerCase();
                                        user.email = params.email.toLowerCase();
                                        user.role = params.role;
                                        user.librosRentados = 0;
        
                                        user.save((err, userSaved)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error general al crear al usuario'});
                                                console.log(err);
                                            }else if(userSaved){
                                                res.send({message: 'Usuario creado exitosamente ', userSaved});
                                            }else{
                                                res.status(400).send({message: 'No se creo al usuario'})
                                            }
                                        })
                                    }else{
                                        res.status(400).send({message: 'Contraseña no encriptada'});
                                    }
                                })
                            }
                        })
                    }
                })
            }else{
                res.send({message: 'Direccion de correo invalida'});
            }
        }else{
            res.send({message: 'Favor de ingresar todos los campos'});
        }
    }
    
}

function editUser(req, res){
    var userId = req.params.idU;
    var data = req.body;
    var emailV = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if(data.email){
                if(emailV.test(data.email)){
                    if(data.username){
                        User.findOne({username: data.username.toLowerCase()}, (err,userFind)=>{
                            if(err){
                                res.status(500).send({message: 'Error general'})
                                console.log(err)
                            }else if(userFind){
                                if(userFind._id == userId){
                                    if(userFind.cui == data.cui){
                                        User.findByIdAndUpdate(userId, data, {new:true}, (err, userUpdated)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error general al actualizar'});
                                                console.log(err);
                                            }else if(userUpdated){
                                                res.send({message: 'Usuario actualizado', userUpdated});
                                            }else{
                                                res.send({message: 'No se actualizo el usuario'});
                                            }
                                        })
                                    }else{
                                        User.findOne({cui: data.cui}, (err,cuiFound)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error general al bucar el cui'});
                                                console.log(err);
                                            }else if(cuiFound){
                                                res.send({message: 'Numero de CUI ya en uso'})
                                            }else{
                                                User.findByIdAndUpdate(userId, data, {new:true}, (err, userUpdated)=>{
                                                    if(err){
                                                        res.status(500).send({message: 'Error general al actualizar'});
                                                        console.log(err);
                                                    }else if(userUpdated){
                                                        res.send({message: 'Usuario actualizado', userUpdated});
                                                    }else{
                                                        res.send({message: 'No se actualizo el usuario'});
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }else{
                                    res.send({message: "Nombre de usuario ya en uso"})
                                }
                            }else{
                                User.findByIdAndUpdate(userId, data, {new:true}, (err, userUpdated)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general al actualizar'});
                                        console.log(err);
                                    }else if(userUpdated){
                                        res.send({message: 'Usuario actualizado', userUpdated});
                                    }else{
                                        res.send({message: 'No se actualizo el usuario'});
                                    }
                                })
                            }
                        })
                    }else{
                        User.findByIdAndUpdate(userId, data, {new:true}, (err, userUpdated)=>{
                            if(err){
                                res.status(500).send({message: 'Error general al actualizar'});
                                console.log(err);
                            }else if(userUpdated){
                                res.send({message: 'Usuario actualizado', userUpdated});
                            }else{
                                res.send({message: 'No se actualizo el usuario'});
                            }
                        })
                    }
                }else{
                    res.send({message: 'Direccion de correo invalida'});
                }
            }else{
                if(data.username){
                    User.findOne({username: data.username.toLowerCase()}, (err,userFind)=>{
                        if(err){
                            res.status(500).send({message: 'Error general'})
                            console.log(err)
                        }else if(userFind){
                            if(userFind._id == req.user.sub){
                                User.findByIdAndUpdate(userId, data, {new:true}, (err, userUpdated)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general al actualizar'});
                                        console.log(err);
                                    }else if(userUpdated){
                                        res.send({message: 'Usuario actualizado', userUpdated});
                                    }else{
                                        res.send({message: 'No se actualizo el usuario'});
                                    }
                                })
                            }else{
                                res.send({message: "Nombre de usuario ya en uso"})
                            }
                        }else{
                            User.findByIdAndUpdate(userId, data, {new:true}, (err, userUpdated)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general al actualizar'});
                                    console.log(err);
                                }else if(userUpdated){
                                    res.send({message: 'Usuario actualizado', userUpdated});
                                }else{
                                    res.send({message: 'No se actualizo el usuario'});
                                }
                            })
                        }
                    })
                }else{
                    User.findByIdAndUpdate(userId, data, {new:true}, (err, userUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error general al actualizar'});
                            console.log(err);
                        }else if(userUpdated){
                            res.send({message: 'Usuario actualizado', userUpdated});
                        }else{
                            res.send({message: 'No se actualizo el usuario'});
                        }
                    })
                }
            }
}

function deleteUser(req,res){
    var userId = req.params.idU;

        User.findById(userId, (err,userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general al buscar al usuario'});
                console.log(err);
            }else if(userFind){
                User.findByIdAndRemove(userId, (err, userDeleted)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al eliminar al usuario'});
                        console.log(err);
                    }else if(userDeleted){
                        res.send({message: 'Usuario eliminado ', userDeleted});
                    }else{
                        res.status(401).send({message: 'No se elimino al usuario'});
                    }
                })
            }else{
                res.status(404).send({message: 'El usuario que quieres eliminar no existe'});
            }
        })
}

function editUserAdmin(req, res){
    var userId = req.params.idU;
    var data = req.body;
    var adminId = req.params.idA;

    if(adminId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para actualizar un usuario'});
    }else{
        if(data.password){
            res.status(403).send({message: 'No es posible actualizar contraseña del usuario'}); 
        }else{
            if(data.username){
                User.findOne({username: data.username.toLowerCase()}, (err,userFind)=>{
                    if(err){
                        res.status(500).send({message: 'Error general'})
                        console.log(err)
                    }else if(userFind){
                        if(userFind._id == req.user.sub){
                            User.findByIdAndUpdate(userId, data, {new:true}, (err, userUpdated)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general al actualizar'});
                                    console.log(err);
                                }else if(userUpdated){
                                    res.send({message: 'Usuario actualizado', userUpdated});
                                }else{
                                    res.send({message: 'No se actualizo el usuario'});
                                }
                            })
                        }else{
                            res.send({message: "Nombre de usuario ya en uso"})
                        }
                    }else{
                        User.findByIdAndUpdate(userId, data, {new:true}, (err, userUpdated)=>{
                            if(err){
                                res.status(500).send({message: 'Error general al actualizar'});
                                console.log(err);
                            }else if(userUpdated){
                                res.send({message: 'Usuario actualizado', userUpdated});
                            }else{
                                res.send({message: 'No se actualizo el usuario'});
                            }
                        })
                    }
                })
            }else{
                User.findByIdAndUpdate(userId, data, {new:true}, (err, userUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al actualizar'});
                        console.log(err);
                    }else if(userUpdated){
                        res.send({message: 'Usuario actualizado', userUpdated});
                    }else{
                        res.send({message: 'No se actualizo el usuario'});
                    }
                })
            }
        }
    }
}

function uploadImage(req, res){
    var userId = req.params.id;
    var update = req.body;
    var fileName;

    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para cambiar la foto de otro usuario'});
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
                    User.findByIdAndUpdate(userId, {image: fileName}, {new:true}, (err, userUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error general'});
                        }else if(userUpdated){
                            res.send({user: userUpdated, userImage:userUpdated.image});
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

function getImage(req,res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/user/' + fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}

function getUsers(req,res){
    User.find({}).exec((err, users)=>{
        if(err){
            res.status(500).send({message: 'Error general al buscar usuarios'});
            console.log(err)
        }else if(users){
            res.send({message: 'Usuarios encontrados: ', users})
        }else{
            res.send({message: 'No existe ningun usuario'})
        }
    })
}

function getBibliotecarios(req,res){
    var adminId = req.params.idA;

    if(adminId != req.user.sub){
        res.status(403).send({message: 'No tienes permisos para realizar esta acción'});
    }else{
        User.find({role: "ROLE_BIBLIOTECARIO"}).exec((err, users)=>{
            if(err){
                res.status(500).send({message: 'Error general al buscar usuarios'});
                console.log(err)
            }else if(users){
                res.send({message: 'Usuarios encontrados: ', users})
            }else{
                res.send({message: 'No existe ningun usuario'})
            }
        })
    }
}

module.exports ={
    createInit,
    login,
    saveUser,
    editUser,
    deleteUser,
    uploadImage,
    getImage,
    getUsers,
    getBibliotecarios,
    editUserAdmin
}
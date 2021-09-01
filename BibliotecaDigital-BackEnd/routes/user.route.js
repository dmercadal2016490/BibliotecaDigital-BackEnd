'use strict'

var express = require('express');
var userController = require('../controller/user.controller');
var connectMultiparty = require('connect-multiparty');
var mdAuth = require('../middlewares/authenticated');
const upload = connectMultiparty({uploadDir: './uploads/user'})

var api = express.Router();

api.post('/login', userController.login);
api.put('/updateUser/:idU', userController.editUser);
api.delete('/deleteUser/:idU', userController.deleteUser);

//Administrador
api.post('/saveUser/:idU', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.saveUser);
api.get('/getUsers',  userController.getUsers)
api.get('/getAdmins/:idA', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.getBibliotecarios);
api.put('/updateUserAdmin/:idU/:idA', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.editUserAdmin);

//image
api.put('/:id/uploadImage', [mdAuth.ensureAuth, upload], userController.uploadImage);
api.get('/getImage/:fileName', [upload], userController.getImage);

module.exports = api;
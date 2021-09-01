'use strict'

var express = require('express');
var librosController = require('../controller/libors.controller');
var connectMultiparty = require('connect-multiparty');
var mdAuth = require('../middlewares/authenticated');
const upload = connectMultiparty({uploadDir: './uploads/books'});

var api = express.Router();

api.post('/addLibro/:idU', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminOrBibliotecario], librosController.addLibro);
api.put('/:idU/agregarCopias/:idL', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminOrBibliotecario], librosController.agregarCopias);
api.put('/:idU/quitarCopias/:idL', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminOrBibliotecario], librosController.quitarCopias);
api.put('/:idU/updateLibro/:idL', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminOrBibliotecario], librosController.updateLibro);
api.delete('/:idU/deleteLibro/:idL', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminOrBibliotecario], librosController.deleteLibro);
api.get('/getLibros', librosController.getLibros)
api.put('/:idU/uploadImageLibro/:idL', [mdAuth.ensureAuth,mdAuth.ensureAuthAdminOrBibliotecario, upload], librosController.uploadImageLibro);
api.get('/getImageLibro/:fileName', [upload], librosController.getImageLibro);
api.get('/getMylibros/:idU', mdAuth.ensureAuth, librosController.getMylibros);

module.exports = api; 

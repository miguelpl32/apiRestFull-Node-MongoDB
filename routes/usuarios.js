const express = require('express');
const usuarioController = require('../controllers/usuarios_controller');
const verificarToken = require('../middlewares/auth');
const ruta = express.Router();

ruta.get('/',verificarToken, usuarioController.listarUsuarios);

ruta.post('/', usuarioController.addUser);

ruta.put('/:email',verificarToken, usuarioController.updateUser); 

ruta.delete('/:email',verificarToken, usuarioController.deleteUser); 

module.exports = ruta;
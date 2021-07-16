const express = require('express');
const cursosController = require('../controllers/cursos_controller');
const verificarToken = require('../middlewares/auth');
const ruta = express.Router();

ruta.get('/',verificarToken, cursosController.listarCursos); 

ruta.post('/',verificarToken, cursosController.addCurso);

ruta.put('/:id',verificarToken, cursosController.modificaCurso);

ruta.delete('/:id',verificarToken, cursosController.deleteCurso);

module.exports = ruta;

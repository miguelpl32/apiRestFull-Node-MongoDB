const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario_model');
//const Joi = require('joi');
const ruta = express.Router();

/* // Para cambiar las variables de entorno de development o production en la terminal
// tenemos que poner set NODE_ENV=development */

ruta.post('/', (req, res) => {
    Usuario.findOne({email: req.body.email}) //validamos email es correcto
        .then(datos => {
            if(datos){
                // validamos la contraseña que es correcta
                const passwordValido = bcrypt.compareSync(req.body.password, datos.password);
                if(!passwordValido) return res.status(400).json({error:'ok', msj:'Usuario o contraseña incorrecta.'});

                //1ª Forma de generar el Token
                const jwToken = jwt.sign({
                    usuario: {_id: datos._id, nombre:datos.nombre, email:datos.email}
                }, config.get('configToken.SEED'), { expiresIn: config.get('configToken.expiration')});

                // 2ª forma generar el token
                // jwt.sign({_id: datos._id, nombre:datos.nombre, email:datos.email},'password'); //Generamos el token

                //Forma de enviar los datos y el token
                res.json({
                  usuario:{
                      _id: datos._id,
                      nombre: datos.nombre,
                      email: datos.email
                  },
                  jwToken  
                })
                //otra forma de enviar el token
               // res.send(jwToken)
               // res.json(datos);
            }else {
                res.status(400).json({
                    error: 'ok',
                    msj:'Usuario o contraseña incorrecta.'
                })
            }
        })
        .catch(err =>{
            res.status(400).json({
                error:'ok',
                msj:'Error en el servicio' + err
            })
        })
});

module.exports = ruta;
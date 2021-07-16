const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario_model');
const Joi = require('joi');
const verificarToken = require('../middlewares/auth');
const ruta = express.Router();

// Esquema de Joi
const schema = Joi.object({
    nombre: Joi.string()        
        .min(3)
        .max(10)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')), 
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

exports.listarUsuarios = (req, res) => {
    let resultado = listarUsuariosActivos();
    resultado.then(usuarios =>{
        res.json(usuarios)
    }).catch(err => {
        res.status(400).json({
             err
        })
    })
};

exports.addUser = (req, res) => {
    let body = req.body;

    Usuario.findOne({email: body.email}, (err, user) =>{
        if(err){
            return res.status(400).json({error:'Server error'})
        }
        if(user){
            //Usuario si existe
            return res.status(400).json({
                msj:'El usuario ya existe'
            })
        }
    })
    // validacion mediante joi
    const {error, value} = schema.validate({nombre: body.nombre, email: body.email});
    if(!error){

        let resultado = crearUsuario(body);
    
        resultado.then(user => {
            res.json({
                nombre: user.nombre,
                email: user.email
            })
        }).catch(err =>{
            res.status(400).json({
                 err
            })
        });
    } else {
        res.status(400).json({
            error 
        })
    }
};

exports.updateUser = (req, res) => {

    const {error, value} = schema.validate({nombre: req.body.nombre});

    if(!error){

        let resultado = actualizarUsuario(req.params.email, req.body);
        resultado.then(valor => {
            res.json({
                nombre: valor.nombre,
                email: valor.email
            })
        }).catch(err => {
            res.status(400).json({
                 err
            })
        })
    }else {
        res.status(400).json({
            error
        })
    }
};

exports.deleteUser = (req, res) => {
    let resultado = desactivarUsuario(req.params.email);
    resultado.then(valor => {
        res.json({
            nombre: valor.nombre,
            email: valor.email
        })
    }).catch(err => {
        res.status(400).json({
            error : err
        })
    })

};

async function crearUsuario(body){
    let usuario = new Usuario({
        email: body.email,
        nombre: body.nombre,
        password: bcrypt.hashSync( body.password, 10) //Encripta la contraseña
    })
    return await usuario.save();
};

async function listarUsuariosActivos(){
    let usuarios = await Usuario.find({"estado": true})
    .select({nombre:1, email:1})
    return usuarios;
};

async function actualizarUsuario(email, body){
    let usuario = await Usuario.findOneAndUpdate({"email": email}, {
        $set: {
            nombre: body.nombre,
            password: body.password
        }
    }, {new: true});
    return usuario;
};


async function desactivarUsuario(email){
    let usuario = await Usuario.findOneAndUpdate({"email": email}, {
        $set: {
            estado: false
        }
    }, { new: true});
    return usuario;
};
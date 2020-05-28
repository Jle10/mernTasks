const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //revisamos si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    //extraer email y password
    const { email, password } = req.body;

    try {
        //revisar que el user es unico
        let usuario = await Usuario.findOne({ email });

        if(usuario) {
            return res.status(400).json({msg: 'El usuario ya existe'});
        }

        //crea nuevo usuario
        usuario = new Usuario(req.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(5);
        usuario.password = await bcryptjs.hash(password, salt);

        //guardar usuario
        await usuario.save();

        //crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmat el token
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 36000000
        }, (error, token) => {
            if(error) throw error;

            //Mensaje de confirmacion
            res.json({token});
        });
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}
const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator')

//crea una nueva tarea
exports.crearTarea = async (req, res) => {
    //revisamos si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    //extraer el proyecto y comprobar si existe
    try {
        const {proyecto} = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            });
        }

        //revisar si el proyecto actual pertenece al usuario
        //verificar creador
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //crear tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

//obtiene las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    //extraer el proyecto y comprobar si existe
    try {
        const {proyecto} = req.query;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({
                msg: 'Tarea no encontrada'
            });
        }

        //revisar si el proyecto actual pertenece al usuario
        //verificar creador
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //obtener las tareas por proyecto
        const tareas = await Tarea.find({proyecto}).sort({creado: -1});
        res.json({tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        //extraer proyecto y comprobar que existe
        const {proyecto, nombre, estado} = req.body;

        //Revisar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea) {
            return res.status(404).json({msg: 'No exista la tarea'});
        }

        //revisar si el proyecto actual pertenece al usuario
        //verificar creador
        const existeProyecto = await Proyecto.findById(proyecto);
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        //crear objeto con una nueva info
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //guardamos los cambios
        tarea = await Tarea.findOneAndUpdate(
            {_id: req.params.id},
            nuevaTarea,
            {new: true});
        res.json({tarea});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//eliminar tarea
exports.eliminarTarea = async(req, res) => {
    try {
        //extraer proyecto y comprobar que existe
        const {proyecto} = req.query;

        //Revisar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea) {
            return res.status(404).json({msg: 'No exista la tarea'});
        }

        //revisar si el proyecto actual pertenece al usuario
        //verificar creador
        const existeProyecto = await Proyecto.findById(proyecto);
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No autorizado'});
        }
        //eliminar tarea
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'tarea eliminada'});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}


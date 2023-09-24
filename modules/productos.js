//modulos para productos

//las rutas para resolver cada verbo http 
//Modulo que se encarga de resolver las rutas de la API REST
//Arquitectura RESTFUL
//Recordar: la API REST trabaja con los verbos HTTP 
//GET, POST, PUT, DELETE, PATCH...
//Crearemos los endpoints para cada verbo

//Modulos requeridos para el proyecto
const express = require('express');
const cors = require('cors');//para evitar restricciones entre llamadas de sitios 
const producto = express.Router();//Trae el metodo router de express para hacer los endpoint
const conex = require("./bdatos");



//Construimos la capa intermedia de la aplicacion  MIDDLEWARE
producto.use(express.json());//serializa la data en json
producto.use(cors()); //Permite acceso externo de otras direcciones IP distitas a mi servicio
producto.options('*', cors()); //Configura las IP admitidas por cors, * significa que las acepta todas

//codificamos los verbos HTTP (Crud tipico)

//Verbo GET = Listar
producto.get('/productos',async(req,res)=>{
    conex.query("SELECT * FROM producto", (error,respuesta)=>{
        if(error){
            throw error;
        }else{
            res.send(respuesta);
        }
        });
})

//Verbo POST =Insertar
//insertar un registro
const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);
let fecha = hoy.toISOString();
let fechaFinal = fecha.split("T");
 producto.post('/productos', async(req,res)=>{

    let data ={
        nombre : req.body.nombre,
        descripcion : req.body.descripcion,
        categoria : req.body.categoria,
        imagen : req.body.imagen,
        imagenes : req.body.imagenes,
        marca : req.body.marca,
        precio : req.body.precio,
        stock  : req.body.stock,
        calificacion : req.body.calificacion,
        estado : req.body.estado,
        fechaCreacion : fechaFinal[0]

    }
    conex.query("INSERT INTO producto set ?", data, (error,respuesta)=>{
        if(error){
            console.log(error);
            res.send(false);

        }else{
         
            res.send(true);
        }
    });
})

//Verbo PUT = Actualizar
producto.put('/productos/:idProducto', async(req,res)=>{
    let id= req.params.idProducto;
    let datos ={
        nombre : req.body.nombre,
        descripcion : req.body.descripcion,
        categoria : req.body.categoria,
        imagen : req.body.imagen,
        imagenes : req.body.imagenes,
        marca : req.body.marca,
        precio : req.body.precio,
        stock  : req.body.stock,
        calificacion : req.body.calificacion,
        estado : req.body.estado,
        fechaCreacion : fechaFinal[0]
       
    };
    conex.query("UPDATE producto SET ? where idProducto = ?", [datos,id]), (error,respuesta)=>{
        if(error){
            console.log(error);
        }else{
            res.status(201)
        }
    };
})

// Verbo DELETE = Borrar
producto.delete('/productos/:idProducto',async(req,res)=>{
    let id = req.params.idProducto;

    conex.query("DELETE FROM producto where idProducto = ?", id), (error,respuesta)=>{
        if(error){
            console.log(error);
        }else{
            res.status(201).send(respuesta);
        }
    };
})   

module.exports = producto;
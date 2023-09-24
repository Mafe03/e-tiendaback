//Modulos requeridos para el proyecto
const express = require('express');
const cors = require('cors');//para evitar restricciones entre llamadas de sitios 
const categorias= express.Router();//Trae el metodo router de express para hacer los endpoint
const conex = require("./bdatos");
const bcrypt = require("bcryptjs"); //encriptar 
const jwt = require("jsonwebtoken");
const { promisify }= require("util");//La trae por defecto NODE JS me permite usar async/await opcion a fetch
const { error } = require('console');
const { CLIENT_RENEG_WINDOW } = require('tls');



//Construimos la capa intermedia de la aplicacion  MIDDLEWARE
categorias.use(express.json());//serializa la data en json
categorias.use(cors()); //Permite acceso externo de otras direcciones IP distitas a mi servicio
categorias.options('*', cors()); //Configura las IP admitidas por cors, * significa que las acepta todas

//codificamos los verbos HTTP (Crud tipico)

//Verbo GET = Listar
categorias.get("/categorias", async (req, res) => {
    try {
      conex.query("SELECT * FROM categorias", (error, respuesta) => {
        if (error) {
          console.log(error);
          throw error;
        } else {
          res.send(respuesta);
        }
      });
    } catch (error) {
      console.log(error);
    }
  });

categorias.post('/categorias', async(req, res)=>{
    try {
        let data ={
            Nombre : req.body.Nombre,
            Imagen : req.body.Imagen
            
        }
        conex.query("insert into categorias set ?",[data],(error,respuesta)=>{
            if(error){
                console.log(error);
                res.send(false);
            }else{
                res.send(true);
            }

        });
         
      
        
    } catch (error) {
       console.log(error)
       console.log.status(404).error;
    }
})
//Verbo PUT = Actualizar
categorias.put("/categorias/:Id", async(req, res) => {
    let id = req.params.Id;
    let datos = {
      Nombre: req.body.Nombre,
      Imagen: req.body.Imagen,
    };
    conex.query(
      "update categorias set ? where Id = ?", [datos, id],(error, respuesta) => {
        if (error) {
          console.log(error);
        } else {
          res.status(201).send(respuesta);
        }
      }
    )
})

// Verbo DELETE = Borrar
categorias.delete('/categorias/:Id', (req,res)=>{
    let id = req.params.Id;

    conex.query("DELETE FROM categorias where Id= ?", id), (error,respuesta)=>{
        if(error){
            console.log(error);
        }else{
            res.status(201).send(respuesta);
        }
    };
})    

module.exports = categorias;
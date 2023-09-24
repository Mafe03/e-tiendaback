//Modulos requeridos para el proyecto
const express = require('express');
const cors = require('cors');//para evitar restricciones entre llamadas de sitios 
const usuario = express.Router();//Trae el metodo router de express para hacer los endpoint
const conex = require("./bdatos");
const bcrypt = require("bcryptjs"); //encriptar 
const secret = process.env.secret;
const jwt = require("jsonwebtoken");
const { promisify }= require("util");//La trae por defecto NODE JS me permite usar async/await opcion a fetch
const { error } = require('console');
const { CLIENT_RENEG_WINDOW } = require('tls');



//Construimos la capa intermedia de la aplicacion  MIDDLEWARE
usuario.use(express.json());//serializa la data en json
usuario.use(cors()); //Permite acceso externo de otras direcciones IP distitas a mi servicio
usuario.options('*', cors()); //Configura las IP admitidas por cors, * significa que las acepta todas

//codificamos los verbos HTTP (Crud tipico)

//Verbo GET = Listar
usuario.get('/usuarios', async(req, res)=>{
    try {
        conex.query("SELECT idUsuarios, nombre, email FROM usuarios",(error,respuesta)=>{
            console.log(respuesta);
            res.send(respuesta);
        } );
      
        
    } catch (error) {
       // throw error;
       console.log(error);
    }
})

/* usuario.get('/usuarios', (req,res)=>{
    conex.query("SELECT * FROM usuarios", (error,respuesta)=>{
        if(error){
            throw error;
        }else{
            res.send(respuesta);
        }
        });
}) */

//Verbo POST =Insertar
//insertar un registro

usuario.post('/usuarios', async(req, res)=>{
    try {
        let data ={
            nombre : req.body.nombre,
            email : req.body.email,
            pass : bcrypt.hashSync(req.body.pass,7),
            direccion : req.body.direccion,
            zonaPostal : req.body.zonaPostal,
            telefono : req.body.telefono,
            esAdmin : req.body.esAdmin
        }
        conex.query("insert into usuarios set ?",[data],(error,respuesta)=>{
            console.log(error);
            res.send(" Insercion Exitosa!")

        });
         
      
        
    } catch (error) {
       console.log(error)
       console.log.status(404).error;
    }
})


/*  usuario.post('/usuarios', (req,res)=>{
    let data ={
        nombre : req.body.nombre,
        email : req.body.email,
        pass : req.body.pass,
        direccion : req.body.direccion,
        zonaPostal : req.body.zonaPostal,
        telefono : req.body.telefono,
        esAdmin : req.body.esAdmin

    }
    conex.query("INSERT INTO usuarios set ?", data, (error,respuesta)=>{
        if(error){
            console.log(error);
        }else{
            res.status(201).send(respuesta);
        }
    });
}) */


usuario.post('/login', async(req,res)=>{
    try {
        const email = req.body.email;
        const pass = req.body.pass;
        //validamos que lleguen los datos completos
        if(!email || !pass){
            console.log("Debe enviar los datos completos");
        }else{
           conex.query("Select * from usuarios where email = ?",[email],async(error,respuesta)=>{
            if(respuesta.length==0 || !await(bcrypt.compare(pass,respuesta[0].pass))){
               // res.send({estado:true, valor : 100}); 
            //    res.sendStatus(200);
               res.send(false);
                //console.log("El usuario y/o la contraseña no es correcta");
            }else{
                //Enviamos las variables al frontend  para que cargue la pagina
                //Se ejecuta cuando password y el user  son correctos
                const token =jwt.sign(
                    {
                        userId:respuesta[0].idUsuarios,
                    }, 
                    secret,
                    {
                        expiresIn:"1d",
                    }
                )

                res.send(
                    {
                        token,
                    }
                )


               // console.log("Bienvenido al sistema de información"); 
            }
           })
        }        
    } catch (error) {
        console.log("Hay un error en la conexión con el server");
    }
})





//Verbo PUT = Actualizar
usuario.put('/usuarios', async(req, res)=>{
    try {
        let data ={
            nombre : req.body.nombre,
            email : req.body.email,
            pass : bcrypt.hashSync(req.body.pass,7),
            direccion : req.body.direccion,
            zonaPostal : req.body.zonaPostal,
            telefono : req.body.telefono,
            esAdmin : req.body.esAdmin
        }
        conex.query("UPDATE usuarios SET ? where idUsuarios = ?",[data],(error,respuesta)=>{
            //console.log(respuesta);
            res.send(" Actualizacion Exitosa!")

        });
         
      
        
    } catch (error) {
       console.log(error)
       console.log.status(404).error;
    }
})
/* usuario.put('/usuarios/:idUsuarios', (req,res)=>{
    let id= req.params.idUsuarios;
    let datos ={
        nombre : req.body.nombre,
        email : req.body.email,
        pass : req.body.pass,
        direccion : req.body.direccion,
        zonaPostal : req.body.zonaPostal,
        telefono : req.body.telefono,
        esAdmin : req.body.esAdmin
       
    };
    conex.query("UPDATE usuarios SET ? where idUsuarios = ?", [datos,id]), (error,respuesta)=>{
        if(error){
            console.log(error);
        }else{
            res.status(201)
        }
    };
}) */

// Verbo DELETE = Borrar
usuario.delete('/usuarios/:idUsuarios', async(req,res)=>{
    let id = req.params.idUsuarios;

    conex.query("DELETE FROM usuarios where idUsuarios = ?", id), (error,respuesta)=>{
        if(error){
            console.log(error);
        }else{
            res.status(201).send(respuesta);
        }
    };
})   

module.exports = usuario;
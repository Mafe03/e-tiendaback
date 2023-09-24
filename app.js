//Puerta de entrada de la app(entry-point), usamos el principio SPR(single-responsibility principle)

//Instanciamos los modulos requeridos
const express = require("express");
const app = express(); //creamos nuestra aplicacion lamando el metodo construtor de express
require("dotenv/config")
const authJwt = require("./helpers/jwt");

app.use("/", require("./modules/productos"));
app.use("/", require("./modules/usuarios")); //redirigimos al modulo Producto donde se resolveran las rutas
app.use("/", require("./modules/categorias"));
app.use(authJwt);

app.listen("5000", () => {
  console.log("Aplicacion ejecutandose en: http://localhost:5000");
});
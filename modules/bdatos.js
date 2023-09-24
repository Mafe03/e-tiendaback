const mysql = require("mysql"); //Instanciamos el modulo
//Creamos la conexion
const cnn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce",
});
//Nos conectamos sin mente como el demente a la bd
cnn.connect((error) => {
  if (error) {
    throw "existe un error en la cadena de conexion";
  } else {
    console.log("Conexion exitosa");
  }
});
//Exporta este modulo para usarlo en otros modulos princiío SRP
module.exports = cnn;
//la clase que valida que todos los request a la api soliciten el token

//const expressJwt = require("express-jwt");
let {expressjwt: jwt} = require("express-jwt");

let authJwt = () => {
    const secret = process.env.secret;
    return jwt ({
        secret,
        algorithms:["HS256"]
    })
}
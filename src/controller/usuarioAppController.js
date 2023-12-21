var usuarioAppModel = require("../model/usuarioAppModel.js");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const secretKey = "hola1234";
const { UserAppModel } = require("../bdConnect");


var usuarioAppController = {};

//controlamos las resouestas del modelo
usuarioAppController.createUser = function (req, res) {
  var userId = req.params.userId;
  req.session.userId = userId;

  var newUserApp = {
    _id: userId,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  let response = { state: false, mensaje: "" };

  if (
    newUserApp.name == undefined ||
    newUserApp.email == null ||
    newUserApp.password == ""
  ) {
    response.mensaje = "Todos los campos son obligatorios";
    console.log("Todos los campos son obligatorios");
  } else {
    usuarioAppModel.ValidarEmail(newUserApp, function (respE) {
      console.log(respE);
      if (respE.existe == true) {
        //error
        response.mensaje = "Este email ya está registrado";
        console.log("Este email ya está registrado");
      } else {
        console.log("Añadiendo");

        //añadimos el usuario a la base de datos
        console.log(newUserApp);
        usuarioAppModel
          .Registrar(newUserApp)
          .then((resp) => {
            //enviamoe el correo
            let transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              auth: {
                user: "esga948@vidalibarraquer.net",
                pass: "39471948S",
              },
            });
            //config correo

            const htmlTemp = fs.readFileSync("../src/email.html", "utf-8");
            const htmlContent = htmlTemp.replace("{{token}}", resp.token);

            let mailOptions = {
              from: "esga948@vidalibarraquer.net",
              to: newUserApp.email,
              subject: "Inicio de sesión",
              html: htmlContent,
            };

            //enviar el correo
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
                res.json({ state: false, error: error });
              } else {
                //console.log(info);
                console.log("Token enviado");
                response.state = true;
                response.mensaje = "Token enviado";
              }
            });
          })
          .catch((error) => {
            res.json({
              state: false,
              mensaje: "Error al almacenar",
              error: error,
            });
          });
      }
    });
  }
  res.json(response);
};

usuarioAppController.loginAppUser = (req, res, next) => {
  const userData = {
    email: req.body.email,
    password: req.body.password,
  };

  let resp = { state: false, msj: "" };

  usuarioAppModel.ValidarEmail(userData, async function (respEmail) {
    if (respEmail.existe == false) {
      resp.msj = "No se ha encontrado el usuario" ;
      console.log("No se ha encontrado el usuario");
    } else {
      var user = await UserAppModel.findOne({ email: userData.email })
      const resultPAssword = userData.password;
      if (resultPAssword != user.password) {
        resp.msj = "Contraseña incorrecta"; 
        console.log("Contraseña incorrecta");
      } else {
        resp.state = true;
        resp.msj =  "Inicio de sesión correcto";
        console.log("Inicio de sesion correcto");
      }
    }
  });
  res.json(resp);
};

usuarioAppController.inicioApp = function (req, res) {
  res.sendFile("C:/Users/estel.garces/Spotify/src/views/inicioApp.html");
};

usuarioAppController.token = function (req, res) {
  res.sendFile("C:/Users/estel.garces/Spotify/src/views/token.html");
};

usuarioAppController.redirectToken = function (req, res) {
  // Redirige a la página de inicio con el userId como parámetro
  res.redirect(`/token?userId=${req.session.userId}`);
};

usuarioAppController.inicio = function (req, res) {
  res.sendFile("C:/Users/estel.garces/Spotify/src/views/inicio.html");
};

usuarioAppController.redirectInicio = function (req, res) {
  // Redirige a la página de inicio con el userId como parámetro
  res.redirect(`/inicio?userId=${req.session.userId}`);
};

module.exports = usuarioAppController;

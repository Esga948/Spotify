//var usuarioAppModel = require("../model/usuarioAppModel.js");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const secretKey = "hola1234";
const { UserAppModel } = require("../bdModel.js");

var usuarioAppController = {};

//controlamos las resouestas del modelo
usuarioAppController.createUser = function (req, res) {
  var userId = req.params.userId;
  req.session.userId = userId;
  var salt = bcrypt.genSaltSync(10);

  const token = Math.round(Math.random() * 999999);

  var newUserApp = {
    //_id: userId,
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt),
    token: token,
  };

  UserAppModel.create(newUserApp)
    .then((user) => {
      const expiresIn = 24 * 60 * 60;
      const aToken = jwt.sign({ id: user.id }, secretKey, {
        expiresIn: expiresIn,
      });
      const dataUser = {
        name: user.name,
        email: user.email,
        aToken: aToken,
        expiresIn: expiresIn,
      };
      console.log(dataUser);
      //resp al front
      res.send({ dataUser });

      //envio del correo
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
          user: "esga948@vidalibarraquer.net",
          pass: "39471948S",
        },
      });
      //config correo

      const htmlTemp = fs.readFileSync("../backend/email.html", "utf-8");
      const htmlContent = htmlTemp.replace("{{token}}", token);

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
        } else {
          //console.log(info);
          console.log("Token enviado");
        }
      });
    })
    .catch((error) => {
      if (error && error.code === 11000) {
        console.log("Error de clave única. Email ya existe.");
        return res.status(409).json({ message: "Email ya existe" });
      } else {
        console.error("Error al crear el usuario:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
      }
    });
  //let response = { state: false, mensaje: "" };
  /*
   usuarioAppModel.ValidarEmail(newUserApp, function (respE) {
    //console.log(respE);
    if (respE.existe == true) {
      //error
      error.json({ state: false, mensaje: "Email ya registrado" });
      console.log("Este email ya está registrado");
    } else {
      console.log("Añadiendo");

      //añadimos el usuario a la base de datos
      //console.log(newUserApp);
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

          const htmlTemp = fs.readFileSync("../backend/email.html", "utf-8");
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
              res.status(500).json({ error: error });
            } else {
              //console.log(info);
              console.log("Token enviado");
              res.json({ state: true, mensaje: "Token enviado" });
            }
          });
        })
        .catch((error) => {
          error.json({
            state: false,
            mensaje: "Error al almacenar",
            error: error,
          });
        });
    }
  });*/
};

usuarioAppController.loginAppUser = async (req, res, next) => {
  const userData = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const user = await UserAppModel.findOne({ email: userData.email });
    if (!user) {
      console.log("No se ha encontrado el email");
      return res.status(409).json({ msj: "Error" });
    } else {
      const resultPass = bcrypt.compareSync(userData.password, user.password);
      console.log(resultPass);
      if (resultPass) {
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user.id }, secretKey, {
          expiresIn: expiresIn,
        });

        const dataUser = {
          name: user.name,
          email: user.email,
          accessToken: accessToken,
          expiresIn: expiresIn,
        };
        return res.json({ dataUser });
      } else {
        console.log("Contraseña incorrecta");
        return res.status(408).json({ msj: "Error" });
      }
    }
  } catch (err) {
    console.log("Error: " + err);
    return res.status(500).json({ msj: "Error" });
  }
  /*
  UserAppModel.findOne({ email: userData.email }, (err, user) => {
    if (err) return res.status(500).send("Server error");
    if (!user) {
      //usuario no encontrado
      console.log("usuario no encontrado");
      res.status(409).send({ msj: "Error" });
    } else {
      const resultPass = userData.password;
      if (resultPass) {
        const expiresIn = 14 * 60 * 60;
        const aToken = jwt.sign({ id: user.id }, secretKey, {
          expiresIn: expiresIn,
        });
        res.send({ userData });
      } else {
        //contraseña incorrecta
        console.log("Contraseña incorrecta");
        res.status(409).send({ msj: "Error" });
      }
    }
  });
  usuarioAppModel.ValidarEmail(userData, async function (respEmail) {
    if (respEmail.existe == false) {
      resp.msj = "No se ha encontrado el usuario";
      console.log("No se ha encontrado el usuario");
    } else {
      var user = await UserAppModel.findOne({ email: userData.email });
      const resultPAssword = userData.password;
      if (resultPAssword != user.password) {
        resp.msj = "Contraseña incorrecta";
        console.log("Contraseña incorrecta");
      } else {
        resp.state = true;
        resp.msj = "Inicio de sesión correcto";
        console.log("Inicio de sesion correcto");
      }
    }
  });
  res.json(resp);
  */
};
/*
usuarioAppController.inicioApp = function (req, res) {
  res.sendFile("C:/Users/estel.garces/Spotify/backend/views/inicioApp.html");
};

usuarioAppController.token = function (req, res) {
  res.sendFile("C:/Users/estel.garces/Spotify/backend/views/token.html");
};

usuarioAppController.redirectToken = function (req, res) {
  // Redirige a la página de inicio con el userId como parámetro
  res.redirect(`/token?userId=${req.session.userId}`);
};

usuarioAppController.inicio = function (req, res) {
  res.sendFile("C:/Users/estel.garces/Spotify/backend/views/inicio.html");
};

usuarioAppController.redirectInicio = function (req, res) {
  // Redirige a la página de inicio con el userId como parámetro
  res.redirect(`/inicio?userId=${req.session.userId}`);
};
*/
module.exports = usuarioAppController;

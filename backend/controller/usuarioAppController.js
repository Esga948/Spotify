//var usuarioAppModel = require("../model/usuarioAppModel.js");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const secretKey = "hola1234";
const { UserAppModel } = require("../bdModel.js");

var usuarioAppController = {};

//funcion para crear el usuario y guardarlo en la base de datos
usuarioAppController.createUser = function (req, res) {
  var userId = req.params.userId;
  req.session.userId = userId;
  var salt = bcrypt.genSaltSync(10);

  const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

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
      //enviamos la respuesta al front
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
};

//funcion para iniciar sesion y comprobaciones
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
};

//verificar que el token es igual al que se ha enviado
usuarioAppController.authToken = async function (req, res) {
  const front = req.body.token;
  const email = req.body.email;

  try {
    const user = await UserAppModel.findOne({ email: email });

    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ msj: "Usuario no encontrado" });
    } else {
      const tokens = front.token === user.token;
      //console.log("Booleano: " + tokens);
      return res.json({ tokens });
    }
  } catch (error) {
    console.log("Error: " + error);
    return res.status(500).json({ msj: "Error del servidor" });
  }
};


module.exports = usuarioAppController;

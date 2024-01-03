var express = require("express");
//var request = require("request");
var session = require("express-session");
//var querystring = require("querystring");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/routes");

const app = express();
const router = express.Router();
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });

//configuracion base de datos
var port = "8080";
const url =
  "mongodb+srv://estelgarcesext:ZySSfXFqTDN2eKM4@cluster0.mrutfie.mongodb.net/Spoty";

//middleware para parsear solicitudes JSON y URL encoded
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

//permiso para usar credenaciales de acceso desde el forntend
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

//Habilitar el corse hablitar el acceso desde alguna url (localhost:8080)
app.use(cors());

//Sistema de sesion
app.use(
  session({
    secret: "clave",
    resave: false,
    saveUninitialized: false,
  })
);

//Rutas
router.use("/", routes);
app.use("/", router);

//conexión a la base de datos
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bd = mongoose.connection;
bd.on("error", (error) => {
  console.log("Error de conexion a la base de datos " + error);
});
bd.once("open", () => {
  console.log("Conexion con la base de datos");
});

//levantamos el servidor
app.listen(port, function () {
  console.log("Listening port: " + port);
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error!");
});

var express = require("express");
var request = require("request");
var session = require("express-session");
var querystring = require("querystring");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/routes");

const app = express();
const router = express.Router();
const bodyParserJSON = bodyParser.json();
const bodyParserURLEncoded = bodyParser.urlencoded({ extended: true });

var port = "8080";
const url =
  "mongodb+srv://estelgarcesext:ZySSfXFqTDN2eKM4@cluster0.mrutfie.mongodb.net/Spoty";

app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

//permiso para usar credenaciales de acceso desde el forntend
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

//Habilitar el corse hablitar el acceso desde alguna url (localhost:8080)
app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//Sistema de sesion para almacenarlo
app.use(
  session({
    secret: "clave",
    resave: false,
    saveUninitialized: false,
  })
);

//archivo de rutas
router.use("/", routes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error!");
});

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

app.use("/", router);

//levantamos el servidor
app.listen(port, function () {
  console.log("Listening port: " + port);
});

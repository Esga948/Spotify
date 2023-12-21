const mongoose = require("mongoose");
const { UserAppModel } = require("../bdConnect");

var usuarioAppModel = {};
//logica para obetner los datos
usuarioAppModel.ValidarEmail = function (userNew, callback) {
  UserAppModel.findOne({ email: userNew.email })
    .then((user) => {
      if (!user) {
        callback({ state: true, existe: false });
      } else {
        callback({ state: true, existe: true });
      }
    })
    .catch((error) => {
      callback({ state: false, error: error });
    });
};

usuarioAppModel.Registrar = function (newUserApp) {
  return new Promise((resolve, reject) => {
    const userApp = new UserAppModel({
      _id: newUserApp._id,
      name: newUserApp.name,
      email: newUserApp.email,
      password: newUserApp.password,
      rol: 2,
      token: Math.round(Math.random() * (999999 - 100000) + 100000),
    });

    //console.log(userApp);
    userApp
      .save()
      .then(() => {
        resolve({ state: true, token: userApp.token });
        console.log("Guardado correctamente");
      })
      .catch((error) => {
        reject({ state: false, error: error });
        console.log("Error " + error);
      });
  });
};

module.exports = usuarioAppModel;

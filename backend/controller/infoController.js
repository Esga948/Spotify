var express = require("express");
const CircularJSON = require("circular-json");
const router = express.Router();
const mongoose = require("mongoose");
const {
  UserModel,
  UserAppModel,
  TrackModel,
  ArtistModel,
} = require("../bdModel");

var infoController = {};

//funcion para obtener la informacion del usuario
infoController.datsU = async function (req, res) {
  try {
    var userId = req.params.userId;
    var usuario = await UserModel.findById(userId);
    if (usuario) {
      return res.json(usuario);
    } else {
      return res.status(404).json({ msj: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msj: "Error en el servidor" });
  }
};

//funcion para obtener la informacion de las canciones
infoController.datsT = async function (req, res) {
  try {
    var trackId = req.params.trackId;
    var track = await TrackModel.findById(trackId);
    if (track) {
      return res.json(track);
    } else {
      return res.status(404).json({ msj: "Track no encontrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msj: "Error en el servidor" });
  }
};

//funcion para obtener los datos de los artistas
infoController.datsA = async function (req, res) {
  try {
    var artistId = req.params.artistId;
    var artista = await ArtistModel.findById(artistId);
    if (artista) {
      return res.json(artista);
    } else {
      return res.status(404).json({ msj: "Artista no encontrado" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msj: "Error en el servidor" });
  }
};

//funcion para poner el id en los usuarios de la app
infoController.users = async function (req, res) {
  try {
    const email = req.params.email;
    const userId = req.params.userId;

    //arreglar
    const usuario = await UserAppModel.findOne({ email: email });
    if (usuario.idSpoty === "") {
      const exist = await UserAppModel.findOne({ idSpoty: userId });
      if (exist) {
        UserAppModel.remove({ email: email });
        return res.status(409).json({ msj: "Ya existe un usuario vinculado a esa cuenta de spotify" });
      } else {
        usuario.idSpoty = userId;
        await usuario.save();
        return res.json({ msj: "El id se ha guardado correctamente" });
      }
    } else {
      return res.json({ msj: "Usuario ya registrado" })
    }
  } catch (error) {
    console.error("Error en la ruta /users:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

module.exports = infoController;

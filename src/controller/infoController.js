var express = require("express");
const CircularJSON = require('circular-json');
const router = express.Router();
const mongoose = require("mongoose");
const {
  UserModel,
  UserAppModel,
  TrackModel,
  ArtistModel,
} = require("../bdConnect");

var infoController = {};
/*
infoController.datsUApp = function (req, res) {
  try {
    var userId = req.params.userId;
    console.log("uSER ID: " + userId);
    var usuario = UserAppModel.findById(userId);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.log(error);
  }
};*/

infoController.datsU = async function (req, res) {
  try {
    var userId = req.params.userId;
    //console.log("usER ID: " + userId);
    var usuario = await UserModel.findById(userId);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.log(error);
  }
};

infoController.datsT = async function (req, res) {
  try {
    var trackId = req.params.trackId;
    var track = await TrackModel.findById(trackId);
    if (track) {
      res.json(track);
    } else {
      res.status(404).json({ message: "Track no encontrado" });
    }
  } catch (error) {
    console.log(error);
  }
};

infoController.datsA = async function (req, res) {
  try {
    var artistId = req.params.artistId;
    var artista = await ArtistModel.findById(artistId);
    if (artista) {
      res.json(artista);
    } else {
      res.status(404).json({ message: "Artista no encontrado" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = infoController;

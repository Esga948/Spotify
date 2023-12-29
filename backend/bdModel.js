const mongoose = require("mongoose");
/*
const url =
  "mongodb+srv://estelgarcesext:ZySSfXFqTDN2eKM4@cluster0.mrutfie.mongodb.net/Spoty";

//conexión a la base de datos
connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
*/
// Define el modelo para guardar los usuarios de spotify
const userSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    email: { type: String, required: true, unique: true },
    tracks: [String],
  },
  { collection: "Users" }
);
const UserModel = mongoose.model("Users", userSchema);

// Define el modelo para guardar los usuarios
const userSchema2 = new mongoose.Schema(
  {
    //_id: String,
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    rol: Number,
    token: String,
  },
  { collection: "UsersApp" }
);

userSchema2.statics = {
  create: function (data) {
    const user = new this(data);
    return user.save();
  },
  login: function (query) {
    return this.find(query);
  },
};
const UserAppModel = mongoose.model("UsersApp", userSchema2);

// Define el modelo para guardar las canciones
const trackSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    idAlbum: String,
    album: String,
    idsArtist: [String],
  },
  { collection: "Tracks" }
);
const TrackModel = mongoose.model("Tracks", trackSchema);

// Define el modelo para guardar los artistas
const artistSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    genres: [String],
  },
  { collection: "Artists" }
);
const ArtistModel = mongoose.model("Artists", artistSchema);

module.exports = {
  UserModel,
  UserAppModel,
  TrackModel,
  ArtistModel,
};

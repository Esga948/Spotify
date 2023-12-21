var request = require("request");
var session = require("express-session");
var querystring = require("querystring");
const { UserModel, TrackModel, ArtistModel } = require("../bdConnect");

var usuarioController = {};

const client_id = "9f2a36c421ee43b59fc09d616c39c0f6";
const client_secret = "cdbf2a5d45624a21a002e508b1529ec8";

const redirect_uri = "http://localhost:8080/callback";

//Clave de estado para proteger contra ataques CSR
var stateKey = "spotify_auth_state";

//Función para generar una cadena aleatoria
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

//creamos una funcion para mandar los endpoint y que guarde la informacion pedida
async function fetchSpotifyData(endpoint, access_token) {
  const options = {
    url: `https://api.spotify.com/${endpoint}`,
    headers: { Authorization: `Bearer ${access_token}` },
    json: true,
  };
  return new Promise((resolve, reject) => {
    request.get(options, (error, response, body) => {
      if (!error) {
        if (response.statusCode === 200) {
          resolve(body);
        } else {
          reject({
            statusCode: response.statusCode,
            message: "Respuesta no exitosa",
          });
        }
      } else {
        reject(error);
      }
    });
  });
}

usuarioController.i = function (req, res) {
  res.sendFile("C:/Users/estel.garces/Spotify/src/views/index.html");
};

usuarioController.login = function (req, res) {
  //Genera una clave de estado y la guarda en la sesión del usuario
  var state = generateRandomString(16);
  req.session[stateKey] = state;

  //La aplicacion redirige a la pagina de inicio de sesión de Spotify y guarda los permisos
  var scope =
    "user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-read-playback-position user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
        show_dialog: "false",
      })
  );
};
usuarioController.callback = function (req, res) {
  //La aplicación recibe un código de autorización y verifica el estado, obtiene el estado almacenado en la sesión
  var code = req.query.code || null;
  var state = req.query.state || null;
  var sessionState = req.session[stateKey];

  if (state === null || state !== sessionState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    //Si el estado coincide, la aplicación hace una solicitud
    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    //solicitud para obtener tokens de acceso y actualización
    request.post(authOptions, async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let access_token = body.access_token;
        let refresh_token = body.refresh_token;

        try {
          // Endpoint para guardar los datos de usuario
          var userInfo = await fetchSpotifyData("v1/me", access_token);
          //guarda en la session el id del usuario que inicia sesion
          req.session.userId = userInfo.id;
        } catch (error) {
          console.error("Error al obtener la información del usuario " + error);
        }
        try {
          var existeU = await UserModel.findOne({ _id: userInfo.id });
          // Si el usuario no existe, lo añadirá en la base de datos; de lo contrario, enviará un mensaje de aviso por consola
          var User;
          if (!existeU) {
            User = new UserModel({
              _id: userInfo.id,
              name: userInfo.display_name,
              email: userInfo.email,
            });
            await User.save();
            console.log("Usuario guardado en la base de datos");
          } else {
            console.log("Ya está registrado en la base de datos");
          }
        } catch (error) {
          console.error(
            "Error al guardar el usuario en  la base de datos " + error
          );
        }
        try {
          //endpoint para guardar las canciones mas escuchadas de un usuario y poder hacer el top de generos
          const topTracks = await fetchSpotifyData(
            "v1/me/top/tracks?time_range=long_term&limit=5",
            access_token
          );

          //guardamos el top de canciones de la persona en la base de datos
          const topTracksId = topTracks.items.map((trackItem) => trackItem.id);
          if (!existeU) {
            User.tracks = topTracksId;
            await User.save();
          } else {
            existeU.tracks = topTracksId;
            await existeU.save();
          }

          //bucle para guardar todas las canciones en la base de datos
          for (const trackItem of topTracks.items) {
            const existeT = await TrackModel.findOne({ _id: trackItem.id });
            if (!existeT) {
              const trackId = trackItem.id;
              const trackName = trackItem.name;
              const albumId = trackItem.album.id;
              const albumName = trackItem.album.name;
              const artists = trackItem.artists.map((artist) => ({
                id: artist.id,
              }));
              const idsArtist = artists.map((artist) => artist.id);
              const newTrack = new TrackModel({
                _id: trackId,
                name: trackName,
                idAlbum: albumId,
                album: albumName,
                idsArtist: idsArtist,
              });
              await newTrack.save();
              for (let i = 0; i < idsArtist.length; i++) {
                const artistsA = await fetchSpotifyData(
                  `v1/artists/${idsArtist[i]}`,
                  access_token
                );
                const existArtist = await ArtistModel.findOne({
                  _id: artistsA.id,
                });
                if (!existArtist) {
                  const genresA = artistsA.genres;
                  const newArtist = new ArtistModel({
                    _id: artistsA.id,
                    name: artistsA.name,
                    genres: genresA,
                  });
                  await newArtist.save();
                }
              }
            }
          }
        } catch (error) {
          console.error("Error al guardar las canciones" + error);
        }
        console.log("Fin de la ejecución");
        // Una vez iniciada la sesión, redirigimos a la página de inicio
        res.redirect("/redirectRegister");
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
};

usuarioController.refreshToken = function (req, res) {
  // requesting access token from refresh token
  refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  //Hace una solicitud para obtener un nuevo token de acceso
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
};

usuarioController.register = function (req, res) {
  res.sendFile("C:/Users/estel.garces/Spotify/src/views/register.html");
};

usuarioController.redirectRegister = function (req, res) {
  // Redirige a la página de inicio con el userId como parámetro
  res.redirect(`/register?userId=${req.session.userId}`);
};

usuarioController.logout = async function (req, res) {
  try {
    //elimina los tokens de la base de datos
    var user = await UserModel.findOne({ _id: req.session.userId });
    if (user) {
      user.access_token = "";
      user.refresh_token = "";
      await user.save();
    }
  } catch (error) {
    console.error("Error al borrar los tokens:", error);
  }

  // Destruye la sesión y borra las cookies
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      // Borra las cookies
      var cookies = req.cookies;
      for (var cookie in cookies) {
        if (!cookies.hasOwnProperty(cookie)) continue;
        res.clearCookie(cookie);
      }
    }
    //limpia las variables token
    access_token = null;
    refresh_token = null;

    res.send(`
    <p>Cierre sesión también en Spotify, <a href="https://www.spotify.com/account">haz clic aquí</a>.</p>
    <p>Después <a href="/">haz clic aquí</a> para volver a la página de inicio.</p>
    `);
  });
};
module.exports = usuarioController;

usuarioAppController.inicio = function (req, res) {
    res.sendFile("C:/Users/estel.garces/Spotify/src/views/inicio.html");
  };
  
  usuarioAppController.redirectInicio = function (req, res) {
    // Redirige a la página de inicio con el userId como parámetro
    res.redirect(`/inicio?userId=${req.session.userId}`);
  };
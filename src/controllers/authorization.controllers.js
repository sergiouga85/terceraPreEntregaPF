export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.rol === 'admin') {
    console.log(req.user.rol)
    return next();
  }
  res.status(403).send('Acceso no autorizado');
};

export const isUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user.rol === 'user') {
    return next();
  }
  res.status(403).send('Acceso no autorizado');
};


  

  



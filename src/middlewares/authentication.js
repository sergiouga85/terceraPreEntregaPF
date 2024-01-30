import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { registerUser, loginUser, jwtAuthentication} from '../controllers/authentication.business.js';
import { JWT_PRIVATE_KEY } from '../config/config.js';
import { usersDao } from '../dao/index.js';


passport.use('localRegister', new LocalStrategy(
  { passReqToCallback: true },
  registerUser
));

passport.use('localLogin', new LocalStrategy(
  loginUser
));

passport.use('jwtAuth', new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([function (req) {
    let token = null;
    if (req?.signedCookies) {
      token = req.signedCookies['authorization'];
    }
    return token;
  }]),
  secretOrKey: JWT_PRIVATE_KEY
}, jwtAuthentication));

// Estrategia "current" para la autenticación del administrador
passport.use('current', new LocalStrategy(
  (username, password, done) => {
    usersDao.findOne({ username: username }, (err, user) => {
      if (err) { return done(err); }
      if (!user || user.rol !== 'admin' || !user.comparePassword(password)) {
        return done(null, false, { message: 'Credenciales inválidas o acceso no autorizado' });
      }
      return done(null, user);
    });
  }
));


passport.serializeUser((user, next) => { next(null, user); });
passport.deserializeUser((user, next) => { next(null, user); });

export const passportInitialize = passport.initialize();
export const passportSession = passport.session();
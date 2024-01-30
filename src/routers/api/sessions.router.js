import { Router } from 'express';
import { loginUser, getCurrentSessionUser, logoutUser } from '../../controllers/sessions.controllers.js';
import { appendJwtAsCookie, removeJwtFromCookies } from '../../controllers/authentication.business.js';
import { usersOnly } from '../../middlewares/authorization.js';
import passport from 'passport'

import { passportLogin,sessionAuth } from '../../middlewares/passport.js';

export const sessionsRouter = Router();


sessionsRouter.post('/', 
    passportLogin,
    appendJwtAsCookie,
    loginUser
);


sessionsRouter.get('/current', 
    sessionAuth,
    getCurrentSessionUser
);


sessionsRouter.delete('/current',
    removeJwtFromCookies,
    logoutUser
);



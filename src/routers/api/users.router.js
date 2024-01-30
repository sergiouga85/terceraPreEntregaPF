import { Router } from 'express';
import { registerUser, getCurrentUser, getAllUsers} from '../../controllers/users.controllers.js';
import {passportLocalRegister,passportAuth} from '../../middlewares/passport.js'



export const usersRouter = Router();

usersRouter.post('/',passportLocalRegister,registerUser);
usersRouter.get('/current',passportAuth,getCurrentUser);
usersRouter.get('/',passportAuth,getAllUsers); 








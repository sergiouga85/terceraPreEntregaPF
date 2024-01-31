import  express from 'express'
import {chatController} from '../../controllers/chat.controllers.js';
import { usersOnly } from '../../middlewares/authorization.js';
import { passportAuth } from '../../middlewares/passport.js';


export const chatRouter = express.Router();

// Rutas para el chat
chatRouter.post('/mensaje',passportAuth,usersOnly,chatController);


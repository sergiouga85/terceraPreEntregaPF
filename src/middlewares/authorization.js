import { isUser, isAdmin } from '../controllers/authorization.controllers.js';

export const usersOnly = isUser;
export const adminsOnly = isAdmin;
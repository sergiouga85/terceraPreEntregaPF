import { usersDao } from '../dao/index.js';
import { appendJwtAsCookie } from './authentication.business.js';
import {UserDTO} from '../dto/userDto.js';

export const registerUser = async (req, res, next) => {
  try {
    appendJwtAsCookie,
    res['successfullPost'](req.user);
  } catch (error) {
    next(error);
  }
}

export const getCurrentUser = async (req, res, next) => {
  try {
    
    // Crear un DTO del usuario con la información necesaria
    const userDTO = new UserDTO(req.user);
    res['successfullGet'](userDTO);
  } catch (error) {
    next(error);
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    authorizationMiddleware(['admin']);
    const usuarios = await usersDao.findAllUsers();
    res['successfullGet'](usuarios);
  } catch (error) {
    next(error);
  }
};

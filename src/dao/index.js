import { connectDb } from '../db/mongodb.js'


import { usersDAO } from './usersDao.js'
import {ProductDao} from './productDao.js'
import {CartDao} from './cartDao.js'
import {ChatDao} from './chatDao.js'
import { TicketDao } from './ticketDao.js'

await connectDb()


export const chatDao= new ChatDao()
export const cartDao= new CartDao()
export const productDao = new ProductDao()
export const usersDao = new usersDAO()
export const ticketDao= new TicketDao()
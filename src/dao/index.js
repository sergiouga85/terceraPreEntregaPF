import { connectDb } from '../db/mongodb.js'


import { BusinessDao } from './businessDao.js'
import { usersDAO } from './usersDao.js'
import {ProductDao} from './productDao.js'
import {CartDao} from './cartDao.js'
import {ChatDao} from './chatDao.js'

await connectDb()


export const chatDao= new ChatDao()
export const businessDao = new BusinessDao()
export const cartDao= new CartDao()
export const productDao = new ProductDao()
export const usersDao = new usersDAO()
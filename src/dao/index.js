import { connectDb } from '../db/mongodb.js'


import { BusinessDao } from './businessDao.js'
import { usersDAO } from './usersDao.js'
import {ProductDao} from './productDao.js'
import {CartDao} from './cartDao.js'

await connectDb()



export const businessDao = new BusinessDao()
export const cartDao= new CartDao()
export const productDao = new ProductDao()
export const usersDao = new usersDAO()
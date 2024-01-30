import { randomUUID } from 'crypto'
import { hasheadasSonIguales, hashear } from '../utils/criptografia.js'


import { Schema, model } from 'mongoose'

const schema = new Schema({
  _id: { type: String},
  first_name:{ type: String, required: true },
  last_name:{ type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  age: { type: String, required: true },
  password: { type: String, required: true },
  cart: { type: String, unique: true, required: true },
  rol: { type: String, default: 'user' },
  orders: {
    type: [
      {
        type: String,
        ref: 'orders'
      }
    ],
    default: []
  }
}, {
  versionKey: false,
  strict: 'throw',
})

export const usersModel = model('users', schema)


//-----------------------------------------------------------



export class usersDAO  {

  async  createUser(userData) {
    try {
      userData.id= randomUUID()
      userData.password = hashear(userData.password)
      const user = await usersModel.create(userData)
      return user.toObject()
    } catch (error) {
      throw new Error('Error creating user');
    }
  };

  async readOne(criteria) {
    const result = await usersModel.findOne(criteria).lean()
    if (!result) throw new Error('NOT FOUND')
    return result
  }

  async readMany(criteria) {
    return await usersModel
      .find(criteria)
      .populate('orders')
      .lean()
  }

  async updateOne(criteria, newData) {
    const modifiedUser = await usersModel
      .findOneAndUpdate(criteria, newData, { new: true })
      .populate('orders')
      .lean()

    if (!modifiedUser) throw new Error('NOT FOUND')
    return modifiedUser
  }

  updateMany(criteria, newData) {
    return Promise.reject(new Error('NOT IMPLEMENTED: usersDao::updateMany'))
  }

  async deleteOne(criteria) {
    const deletedUser = await usersModel
      .findOneAndDelete(criteria)
      .populate('orders')
      .lean()

    if (!deletedUser) throw new Error('NOT FOUND')
    return deletedUser
  }

  deleteMany(criteria) {
    return Promise.reject(new Error('NOT IMPLEMENTED: usersDao::deleteMany'))
  }

  async findUserByUsername  ({username, password}){
    try {
        const user = await usersModel.findOne({ username })
        if (!user) { throw new Error('authentication error') }
        if (!hasheadasSonIguales({
          recibida: password,
          almacenada: user.password
        })) {
          throw new Error('authentication error')
        }
        return user.toObject() 
    } catch (error) {
      throw new Error('Error finding user by username');
    }
  };

  async findAllUsers (){
    try {
      return await usersModel.find({}, { password: 0 }).lean();
    } catch (error) {
      throw new Error('Error finding user by username');
    }
  };

}

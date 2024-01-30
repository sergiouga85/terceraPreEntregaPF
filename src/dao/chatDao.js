

import  mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencia al modelo de usuario (asegúrate de tener un modelo de usuario definido)
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const Chat = mongoose.model('Chat', chatSchema);



//-------------------------------------------------------------------------------------


export class ChatDao {
    
  
    async saveMessage(messageData) {
        try {
          // Crear una instancia del modelo Chat con los datos del mensaje
          const newMessage = new Chat({
            user: messageData.user,
            message: messageData.message,
          });
    
          // Guardar el mensaje en la base de datos
          const savedMessage = await newMessage.save();
    
          return savedMessage;
        } catch (error) {
          throw error;
        }
    }
}
  
  

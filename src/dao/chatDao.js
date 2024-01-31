import  mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: {
    type: String,
    //ferencia al modelo de usuario (asegúrate de tener un modelo de usuario definido)
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

export const Chat = mongoose.model('chats', chatSchema);



//-------------------------------------------------------------------------------------


export class ChatDao {
    async saveMessage(messageData) {
        try {
          // Utilizar el método create para guardar el mensaje en la base de datos
          const savedMessage = await Chat.create({
            user: messageData.user,
            message: messageData.message,
          });
    
          return savedMessage;
        } catch (error) {
          throw error;
        }
    }
}
  
  

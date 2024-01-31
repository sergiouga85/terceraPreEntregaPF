import { chatDao } from "../dao/index.js";


export const chatController = async (req, res) => { 

      try {       
        // Lógica para enviar un mensaje al chat
        const messageData = req.body;
        const savedMessage = await chatDao.saveMessage(messageData);
        res.json(savedMessage);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al enviar el mensaje" });
      }

}



import  mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    default: () => Math.random().toString(36).substring(2, 10).toUpperCase(), // Generar un código aleatorio único
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);



export class ticketDao{

    async createTicket(amount, purchaser) {
        try {
          const ticketGuardado = await Ticket.create({
            amount,
            purchaser,
          });
    
          console.log('Ticket creado con éxito:', ticketGuardado);
          return ticketGuardado;
        } catch (error) {
          console.error('Error al crear el ticket:', error);
          throw error;
        }
      }

}
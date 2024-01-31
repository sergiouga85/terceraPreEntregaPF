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



export class TicketDao{

    async createTicket(ticketData) {
      try {
        const ticket = await Ticket.create(ticketData);
        return ticket;
      } catch (error) {
        throw new Error('Error saving ticket');
      }
    }
}



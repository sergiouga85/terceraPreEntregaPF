

import {ticketDao} from '../dao/index.js'



export class TicketService {
  static async generateTicket(code, purchaseDatetime, amount, purchaser) {
    try {
      const ticketData = {
        code,
        purchase_datetime: purchaseDatetime,
        amount,
        purchaser,
      };
      const newTicket= await ticketDao.createTicket(ticketData)
      //const ticket = new Ticket(ticketData);
      //await ticket.save();

      return newTicket;
    } catch (error) {
      console.error(error);
      throw new Error('Error generating ticket');
    }
  }
}
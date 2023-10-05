import factory from "../factory.js";

export default class RepoTicket {
  constructor() {
    const { ticketManager } = factory;
    this.manager = ticketManager;
  }

  async createTicket(ticket) {
    try {
      console.log("Datos del ticket:", ticket); // Agrega esto
      const newTicket = await this.manager.create(ticket);
      return newTicket;
    } catch (err) {
      console.log(err);
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await this.manager.findById(ticketId);
      return ticket;
    } catch (error) {
      throw error;
    }
}


  }
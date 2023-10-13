import factory from "../factory.js";

export default class RepoTicket {
  constructor() {
    const { ticketManager } = factory;
    this.manager = ticketManager;
  }

  async createTicket(ticket) {
    try {
      const newTicket = await this.manager.create(ticket);
      return newTicket;
    } catch (err) {
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
import ClassController from "./class.controllers.js";
import RepoTicket from "../persistence/daos/repository/ticket.repository.js";

const repoTicket = new RepoTicket();

export class ControllerTicket extends ClassController {
  constructor() {
    super(repoTicket);
  }

  async createTicket(ticketData) {
    try {
      const { purchaser, amount, code, purchase_datetime } = ticketData;
      // Crea el nuevo ticket utilizando los datos de la solicitud
      const newTicket = await repoTicket.createTicket({
        purchaser,
        amount,
        code,
        purchase_datetime,
      });
      // Devuelve el nuevo ticket como respuesta
      return newTicket;
    } catch (err) {
      throw err;
    }
  } 
  
}
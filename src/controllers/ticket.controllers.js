import ClassController from "./class.controllers.js";
import RepoTicket from "../persistence/daos/repository/ticket.repository.js";
import {logger} from '../utils/logger.js'

const repoTicket = new RepoTicket();

export class ControllerTicket extends ClassController {
  constructor() {
    super(repoTicket);
  }

  async createTicket(ticketData) {
    try {
      const { purchaser, amount, code, purchase_datetime } = ticketData;
      const newTicket = await repoTicket.createTicket({
        purchaser,
        amount,
        code,
        purchase_datetime,
      });
      return newTicket;
    } catch (error) {
      logger.error("Error al crear ticket en controlador")
    }
  } 
  
}
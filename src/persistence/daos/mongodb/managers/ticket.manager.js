import MongoDao from "../dao/mongo.dao.js";
import { TicketModel } from "../models/ticket.model.js";

export default class TicketManagerMongo extends MongoDao {
  constructor() {
    super(TicketModel);
  }
}

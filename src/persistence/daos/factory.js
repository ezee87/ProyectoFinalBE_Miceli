import ProductManagerMongo from "./mongodb/managers/products.manager.js";
import UserManagerMongo from "./mongodb/managers/users.manager.js";
import CartManagerMongo from "./mongodb/managers/carts.manager.js";
import TicketManagerMongo from "./mongodb/managers/ticket.manager.js";
import { initMongoDB } from "./mongodb/connection.js";

import ProductManagerFS from "./filesystem/products.dao.js";

let userManager;
let productManager;
let cartManager;
let ticketManager;
let persistence = "mongo";
// let persistence = process.env.PERSISTENCE;

switch (persistence) {
  case "file":
    productManager = new ProductManagerFS(
      "./src/daos/filesystem/products.json"
    );
    //userManager = new UserManagerFS(...)
    break;
  case "mongo":
    await initMongoDB();
    userManager = new UserManagerMongo();
    productManager = new ProductManagerMongo();
    cartManager = new CartManagerMongo();
    ticketManager = new TicketManagerMongo();
    break;
}

export default { userManager, productManager, cartManager, ticketManager };
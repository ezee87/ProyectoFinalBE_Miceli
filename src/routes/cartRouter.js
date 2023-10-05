import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';
import {
  getAllCartsCtr,
  getCartByIdCtr,
  createCartCtr,
  updateCartController,
  deleteCartCtr,
} from "../controllers/carts.controllers.js";
import { ControllerTicket } from "../controllers/ticket.controllers.js";
import ProductController from "../controllers/products.controllers.js";
import { isUser } from "../middlewares/authorization.js";
import { checkAuth } from '../jwt/auth.js';

const ticketController = new ControllerTicket();
const productController = new ProductController();

const router = Router();

router.get("/", getAllCartsCtr);
router.get("/:cartId", getCartByIdCtr);
router.post("/", createCartCtr);
router.put("/:cartId", updateCartController);
router.delete("/:cartId", deleteCartCtr);
router.post("/:cartId/add/:prodId", checkAuth, isUser, productController.addProductToCartCtr);

router.post("/:cartId/purchaser", async (req, res, next) => {
  try {
    const { cartId } = req.params;
    // Aquí puedes obtener los datos necesarios para crear el ticket a partir del carrito
    // Por ejemplo, puedes obtener el comprador y el total de la compra desde el carrito
    const { purchaser, total } = req.body; // Asegúrate de ajustar esto según tu estructura de datos
    console.log('Total:', total)

    const ticketCode = uuidv4(); // Genera el código UUID aquí
    console.log('ticketCode:', ticketCode)

    const ticketData = {
      code: ticketCode,
      purchase_datetime: new Date(),
      amount: total, // Ajusta esto según tu lógica
      purchaser: purchaser,
    };

    console.log("Datos del carrito:", { ticketData}); 
    // Crea el nuevo ticket utilizando tu manager
    const newTicket = await ticketController.createTicket(ticketData);

    // Puedes devolver el nuevo ticket como respuesta
    res.json(newTicket);
  } catch (error) {
    next(error);
  }
});


export default router;
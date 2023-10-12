import { Router } from "express";

import {
  getAllCartsCtr,
  getCartByIdCtr,
  createCartCtr,
  updateCartController,
  deleteCartCtr,
  purchaseCartCtr
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
router.post("/:cartId/purchase", checkAuth, isUser, purchaseCartCtr);

export default router;
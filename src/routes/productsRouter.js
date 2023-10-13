import { Router } from "express";
import ProductController from "../controllers/products.controllers.js";
import { isAdmin, isPremium } from "../middlewares/authorization.js";
import { checkAuth } from '../jwt/auth.js';

const controller = new ProductController();
const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/dto/:id", controller.getProdById);
router.post("/", checkAuth, isPremium, controller.createProd);
router.put("/:id", checkAuth, isAdmin, controller.update);
router.delete("/:id", checkAuth, isPremium, controller.delete);

export default router;
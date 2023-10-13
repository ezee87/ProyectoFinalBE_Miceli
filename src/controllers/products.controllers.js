import Controllers from "./class.controllers.js";
import ProductService, {
  addProductToCartService,
} from "../services/products.services.js";
import { logger } from "../utils/logger.js";
import { createResponse } from "../utils.js";
import mongoose from 'mongoose';

const productService = new ProductService();

export default class ProductController extends Controllers {
  constructor() {
    super(productService);
  }

  getProdById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await this.service.getProdById(id);
      if (!item) {
        createResponse(res, 404, {
          method: "getById",
          error: "No se encuentra el producto por Id",
        });
      } else {
        createResponse(res, 200, item);
      }
    } catch (error) {
      logger.error("Error al traer producto por Id en controlador")
      next(error.message);
    }
  };

  createProd = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const newItem = await this.service.createProd(req.body, userId);
      if (!newItem)
        createResponse(res, 404, {
          method: "create",
          error: "No se pudo crear el producto. Validación incorrecta.",
        });
      else createResponse(res, 200, newItem);
    } catch (error) {
      logger.error("Error al crear producto en controlador")
      next();
    }
  };

  addProductToCartCtr = async (req, res, next) => {
    try {
      const { cartId, prodId } = req.params;

      const product = await productService.getProductById(prodId);

      if (product && (product.owner instanceof mongoose.Types.ObjectId) && (req.user._id instanceof mongoose.Types.ObjectId) && product.owner.equals(req.user._id)) {
        return createResponse(res, 403, {
          method: "addProductToCart",
          error: "No puedes agregar tu propio producto al carrito.",
        });
      }

      const newProduct = await addProductToCartService(cartId, prodId);
      res.json(newProduct);
    } catch (error) {
      logger.error("Error al agregar producto a un carrito en controlador")
      next(error);
    }
  };
}

export { ProductController };

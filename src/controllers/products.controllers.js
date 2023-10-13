import Controllers from "./class.controllers.js";
import ProductService, {
  addProductToCartService,
} from "../services/products.services.js";
import { userModel } from "../persistence/daos/mongodb/models/user.model.js";
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
        console.log("Producto no encontrado");
        createResponse(res, 404, {
          method: "getById",
          error: "Item not found!",
        });
      } else {
        console.log("Producto encontrado:", item);
        createResponse(res, 200, item);
      }
    } catch (error) {
      console.error("Error al buscar el producto por ID:", error);
      next(error.message);
    }
  };

  createProd = async (req, res, next) => {
    try {
      const userId = req.user._id;
      console.log("userId:", userId); // Agrega esta línea para verificar el userId
      const newItem = await this.service.createProd(req.body, userId);
      console.log("Datos recibidos en la solicitud:", req.body);
      if (!newItem)
        createResponse(res, 404, {
          method: "create",
          error: "Validation error!",
        });
      else createResponse(res, 200, newItem);
    } catch (error) {
      next(error.message);
    }
  };
  
  

  addProductToCartCtr = async (req, res, next) => {
    try {
      const { cartId, prodId } = req.params;
  
      // Agrega un registro de depuración para verificar el producto obtenido
      const product = await productService.getProductById(prodId);
      console.log('Producto obtenido:', product);
      console.log('Owner:', product.owner)
      console.log('req.user._id:', req.user._id)
  
      // Verifica si el usuario premium está tratando de agregar su propio producto al carrito
      if (product && (product.owner instanceof mongoose.Types.ObjectId) && (req.user._id instanceof mongoose.Types.ObjectId) && product.owner.equals(req.user._id)) {
        console.log("El usuario está tratando de agregar su propio producto al carrito");
        return createResponse(res, 403, {
          method: "addProductToCart",
          error: "No puedes agregar tu propio producto al carrito.",
        });
      }
  
      // Solo pasa el ID del producto a la función addProductToCartService
      const newProduct = await addProductToCartService(cartId, prodId);
      console.log("Producto agregado al carrito:", newProduct);
      res.json(newProduct);
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      next(error);
    }
  };
}

export {ProductController};

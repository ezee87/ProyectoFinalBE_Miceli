import Controllers from "./class.controllers.js";
import ProductService, {
  addProductToCartService,
} from "../services/products.services.js";
import { userModel } from "../persistence/daos/mongodb/models/user.model.js";
import { createResponse } from "../utils.js";

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
      const newItem = await this.service.createProd(req.body);
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
      const { cartId } = req.params;
      const { prodId } = req.params;

      // Verifica si el usuario premium está tratando de agregar su propio producto al carrito
      const product = await productService.getProdById(prodId);
      if (product && product.owner.toString() === req.user._id.toString()) {
        console.log("El usuario está tratando de agregar su propio producto al carrito");
        return createResponse(res, 403, {
          method: "addProductToCart",
          error: "No puedes agregar tu propio producto al carrito.",
        });
      }

      const newProduct = await addProductToCartService(cartId, prodId);
      console.log("Producto agregado al carrito:", newProduct);
      res.json(newProduct);
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      next(error);
    }
  };
}

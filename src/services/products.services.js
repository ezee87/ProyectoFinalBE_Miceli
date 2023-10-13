import Services from "./class.services.js";
import factory from "../persistence/daos/factory.js";
const { productManager } = factory;
import ProductRepository from "../persistence/daos/repository/products.repository.js";
import CartRepository from "../persistence/daos/repository/carts.repository.js";
import { CartModel } from "../persistence/daos/mongodb/models/carts.model.js"
import { logger } from "../utils/logger.js";

const prodRepository = new ProductRepository();
const cartRepository = new CartRepository();

export default class ProductService extends Services {
  constructor() {
    super(productManager);
  }

  getProdById = async (id) => {
    try {
      const item = await prodRepository.getProdById(id);
      if (!item) return false;
      else return item;
    } catch (error) {
      logger.error(error);
    }
  };

  getProductById = async (id) => {
    try {
      const item = await prodRepository.getProductById(id);
      if (!item) return false;
      else return item;
    } catch (error) {
      logger.error(error);
    }
  };


  getAllProductsService = async (page, limit) => {
    try {
      const item = await prodRepository.getAllProducts(page, limit);
      if (!item) throw new Error("No se pudo traer todos los productos");
      else return item;
    } catch (error) {
    }
  };

  createProd = async (obj, userId) => {
    try {
      obj.owner = userId;
      const newItem = await prodRepository.createProd(obj);
      if (!newItem) return false;
      else return newItem;
    } catch (error) {
      logger.error(error);
    }
  };
}

export const addProductToCartService = async (cartId, prodId) => {
  try {
    const product = await prodRepository.getProductById(prodId);

    if (!product) {
      throw new Error('No se pudo encontrar el producto por su Id');
    }

    const cart = await CartModel.findById(cartId);

    if (!cart) {
      throw new Error('No se pudo encontrar el carrito por su Id');
    }

    const existingProduct = cart.products.find(item => item.product._id.toString() === prodId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      const newProduct = {
        product: product,
        quantity: 1,
      };
      cart.products.push(newProduct);
    }

    const updatedCart = await CartModel.findByIdAndUpdate(
      cartId,
      { products: cart.products },
      { new: true }
    );

    return updatedCart;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};




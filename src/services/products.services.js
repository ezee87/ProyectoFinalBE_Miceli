import Services from "./class.services.js";
import factory from "../persistence/daos/factory.js";
const { productManager } = factory;
import ProductRepository from "../persistence/daos/repository/products.repository.js";
import CartRepository from "../persistence/daos/repository/carts.repository.js";
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

  createProd = async (obj) => {
    try {
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
    const exists = await prodRepository.getProdById(prodId);
    const newProduct = await cartRepository.addProductToCart(cartId, prodId);
    if (!exists) throw new Error("Product not found!");
    else return newProduct;
  } catch (error) {
    logger.error(error);
  }
};
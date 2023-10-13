import Services from "./class.services.js";
import factory from "../persistence/daos/factory.js";
const { productManager } = factory;
import ProductRepository from "../persistence/daos/repository/products.repository.js";
import CartRepository from "../persistence/daos/repository/carts.repository.js";
import {CartModel} from "../persistence/daos/mongodb/models/carts.model.js"
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
      if (!item) throw new Error("Cart not found!");
      else return item;
    } catch (error) {
      console.log(error);
    }
  };

  createProd = async (obj, userId) => {
    try {
      obj.owner = userId;
      console.log("userId en servicio:", userId); // Agrega esta línea para verificar el userId
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
      throw new Error('Product not found');
    }

    // Obtiene el carrito actual
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      throw new Error('Cart not found');
    }

    // Verifica si el producto ya está en el carrito
    const existingProduct = cart.products.find(item => item.product._id.toString() === prodId);

    if (existingProduct) {
      // Si el producto ya existe, incrementa la cantidad
      existingProduct.quantity += 1;
    } else {
      // Si el producto no existe en el carrito, agrégalo
      const newProduct = {
        product: product,
        quantity: 1,
      };
      cart.products.push(newProduct);
    }

    // Actualiza el carrito en la base de datos
    const updatedCart = await CartModel.findByIdAndUpdate(
      cartId,
      { products: cart.products },
      { new: true } // Devuelve la versión actualizada del carrito
    );

    return updatedCart; // Devuelve el carrito actualizado
  } catch (error) {
    logger.error(error);
    throw error;
  }
};




import CartDaoMongoDB from "../persistence/daos/mongodb/dao/carts.dao.js";
const cartDao = new CartDaoMongoDB();
import { __dirname } from "../utils.js";
import {logger} from "../utils/logger.js"
import { ControllerTicket } from "../controllers/ticket.controllers.js"; 
import {ProductController} from "../controllers/products.controllers.js";
import { CartModel } from '../persistence/daos/mongodb/models/carts.model.js';
import { v4 as uuidv4 } from 'uuid';

const productController = new ProductController();
const ticketController = new ControllerTicket();

export const getCartByIdService = async (id) => {
  try {
    const item = await cartDao.getCartById(id);
    if (!item) throw new Error("No se pudo encontrar el carrito por su Id");
    else return item;
  } catch (error) {
    logger.error("Error en el servicio de traer un carrito por Id")
  }
};

export const getAllCartsService = async () => {
  try {
    const item = await cartDao.getAllCarts();
    if (!item) throw new Error("No se pudo traer los carritos");
    else return item;
  } catch (error) {
    logger.error("Error en el servicio de traer todos los carritos")
  }
};

export const createCartService = async (obj) => {
  try {
    const newCart = await cartDao.createCart(obj);
    if (!newCart) throw new Error("No se pudo crear el carrito. Validación incorrecta.");
    else return newCart;
  } catch (error) {
    logger.error("Error en el servicio de crear un carrito")
  }
};

export const updateCartService = async (id, obj) => {
  try {
    let item = await cartDao.getCartById(id);
    if (!item) {
      throw new Error("No se pudo encontrar carrito por su Id");
    } else {
      const cartUpdated = await cartDao.updateCart(id, obj);
      return cartUpdated;
    }
  } catch (error) {
    logger.error("Error en el servicio de actualizar un carrito por Id")
  }
};

export const deleteCartService = async (id) => {
  try {
    const cartDeleted = await cartDao.deleteCart(id);
    return cartDeleted;
  } catch (error) {
    logger.error("Error en el servicio de eliminar un carrito por Id")
  }
};

export const purchaseCartService = async (cid, uid) => {
  try {
    const cart = await CartModel.findById(cid).populate('products.product');

    if (!cart) {
      throw new Error('No se pudo encontrar carrito por su Id');
    }

    const productsNotAvailable = [];

    for (const item of cart.products) {
      const product = item.product;
      const quantityRequested = item.quantity;
      if (product.stock >= quantityRequested) {
        product.stock -= quantityRequested;
        await product.save();
      } else {
        productsNotAvailable.push(product._id);
      }
    }

    const ticketCode = uuidv4();

    if (productsNotAvailable.length === 0) {
      cart.purchased = true;
      await cart.save();

      let totalAmount = 0;

      for (const item of cart.products) {
        const product = item.product;
        const quantityRequested = item.quantity;
        totalAmount += product.price * quantityRequested;
      }

      const ticketData = {
        code: ticketCode,
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: uid,
      };

      return ticketController.createTicket(ticketData);
    } else {
      return { productsNotAvailable };
    }
  } catch (error) {
    console.error(error.message);
    throw new Error(error);
  }
};

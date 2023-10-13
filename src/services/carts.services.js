import CartDaoMongoDB from "../persistence/daos/mongodb/dao/carts.dao.js";
const cartDao = new CartDaoMongoDB();
import fs from "fs";
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
    if (!item) throw new Error("Cart not found!");
    else return item;
  } catch (error) {
    logger.error("Error en el servicio de traer un carrito por Id")
  }
};

export const getAllCartsService = async () => {
  try {
    const item = await cartDao.getAllCarts();
    if (!item) throw new Error("Cart not found!");
    else return item;
  } catch (error) {
    logger.error("Error en el servicio de traer todos los carritos")
  }
};

export const createCartService = async (obj) => {
  try {
    const newCart = await cartDao.createCart(obj);
    if (!newCart) throw new Error("Validation Error!");
    else return newCart;
  } catch (error) {
    logger.error("Error en el servicio de crear un carrito")
  }
};

export const updateCartService = async (id, obj) => {
  try {
    let item = await cartDao.getCartById(id);
    if (!item) {
      throw new Error("Cart not found!");
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
    console.log('cart:', cart);

    if (!cart) {
      throw new Error('Cart not found');
    }

    const productsNotAvailable = [];

    for (const item of cart.products) {
      const product = item.product;
      console.log('Product:', product);
      console.log('item.product:', item.product);
      console.log('Cart.products:', cart.products);

      const quantityRequested = item.quantity;
      console.log('Quantity Requested:', quantityRequested);
      console.log('product.stock:', product.stock);

      if (product.stock >= quantityRequested) {
        console.log('Sufficient Stock:', product.stock);
        product.stock -= quantityRequested;
        await product.save();
      } else {
        productsNotAvailable.push(product._id);
        console.log('Insufficient Stock:', product.stock);
      }
    }

    const ticketCode = uuidv4();

    console.log('Products Not Available:', productsNotAvailable);

    if (productsNotAvailable.length === 0) {
      cart.purchased = true;
      await cart.save();

      // Calcular el 'amount' total del carrito
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
      console.log('Products Not Available:', productsNotAvailable);
      return { productsNotAvailable };
    }
  } catch (error) {
    console.error(error.message);
    throw new Error(error);
  }
};

import CartDaoMongoDB from "../persistence/daos/mongodb/dao/carts.dao.js";
const cartDao = new CartDaoMongoDB();
import fs from "fs";
import { __dirname } from "../utils.js";
import {logger} from "../utils/logger.js"
import { ControllerTicket } from "../controllers/ticket.controllers.js"; 
import {ProductController} from "../controllers/products.controllers.js";
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

export const purchaseCartService = async (cartId, purchaser) => {
  try {
    // Obtén el carrito por su ID
    const cart = await cartDao.getCartById(cartId);

    // Inicializa una variable para almacenar los IDs de productos no comprados
    const productsNotPurchased = [];

    // Inicializa una variable para calcular el total de la compra
    let total = 0;

    // Recorre los productos en el carrito
    for (const productId of cart.products) {
      // Obtén el producto por su ID
      const product = await productController.getProdById(productId);

      // Verifica si hay suficiente stock para la cantidad deseada
      if (product.stock >= 1) {
        // Resta la cantidad del producto del stock
        product.stock -= 1;
        await product.save();

        // Agrega el precio del producto al total
        total += product.price;
      } else {
        // Agrega el ID del producto al array de productos no comprados
        productsNotPurchased.push(productId);
      }
    }

    // Si hay productos que no se pudieron comprar, actualiza el carrito
    if (productsNotPurchased.length > 0) {
      cart.products = productsNotPurchased;
      await cart.save();
    } else {
      // Si todos los productos se compraron con éxito, vacía el carrito
      cart.products = [];
      await cart.save();
    }

    // Genera un código de ticket único
    const ticketCode = uuidv4();

    // Crea un nuevo ticket con los datos de la compra
    const ticketData = {
      code: ticketCode,
      purchase_datetime: new Date(),
      amount: total,
      purchaser: purchaser,
    };

    // Crea el nuevo ticket utilizando tu controlador de tickets
    const newTicket = await ticketController.createTicket(ticketData);

    // Devuelve el resultado de la compra
    return {
      success: productsNotPurchased.length === 0,
      ticket: newTicket,
      productsNotPurchased: productsNotPurchased,
    };
  } catch (error) {
    throw error;
  }
};

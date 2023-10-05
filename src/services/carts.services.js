import CartDaoMongoDB from "../persistence/daos/mongodb/dao/carts.dao.js";
const cartDao = new CartDaoMongoDB();
import fs from "fs";
import { __dirname } from "../utils.js";
import {logger} from "../utils/logger.js"
import { TicketModel } from "../persistence/daos/mongodb/models/ticket.model.js";

export const purchaseCartService = async (cartId, purchaser, amount) => {
  try {
    const code = generateUniqueCode();

    const newTicket = new TicketModel({
      code,
      amount,
      purchaser,
    });

    const savedTicket = await newTicket.save();

    return savedTicket;
  } catch (error) {
    throw error;
  }
};

const generateUniqueCode = () => {
  const uniqueString = "TICKET-" + Date.now().toString();
  return uniqueString;
};

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
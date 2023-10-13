import * as service from "../services/carts.services.js";
import { HttpResponse } from "../utils/http.response.js";
import {logger} from "../utils/logger.js"

const httpResponse = new HttpResponse();


export const getCartByIdCtr = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const item = await service.getCartByIdService(cartId);
    if (!item) return httpResponse.NotFound(res, "Carrito no encontrado");

    res.json(item);
  } catch (error) {
    logger.error("Error al traer carrito por Id en controlador")
    next(error);
  }
};

export const getAllCartsCtr = async (req, res, next) => {
  try {
    const items = await service.getAllCartsService();
    res.json(items);
  } catch (error) {
    logger.error("Error al traer carritos en controlador")
    next(error);
  }
};

export const createCartCtr = async (req, res, next) => {
  try {
    const cart = { ...req.body };
    const newCart = await service.createCartService(cart);
    if (!newCart) return httpResponse.NotFound(res, "Validacion erronea");
    else res.json(newCart);
  } catch (error) {
    logger.error("Error al crear carrito en controlador")
    next(error);
  }
};

export const updateCartController = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { products } = req.body;
    await service.getCartByIdService(cartId);
    const docUpd = await service.updateCartService(cartId, {
      products,
    });
    res.json(docUpd);
  } catch (error) {
    logger.error("Error al actualizar carrito por Id en controlador")
    next(error);
  }
};

export const deleteCartCtr = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    await service.deleteCartService(cartId);
    return httpResponse.Ok(res, "Item eliminado");
  } catch (error) {
    logger.error("Error al elimiar carrito por Id en controlador")
    next(error);
  }
};
export const purchaseCartCtr = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const purchaser = req.user.email;
    const result = await service.purchaseCartService(cartId, purchaser);
    if (result.productsNotAvailable && result.productsNotAvailable.length > 0) {
      res.status(400).json({ error: "No se pudieron comprar algunos productos", productsNotPurchased: result.productsNotAvailable });
    } else {
      res.json(result.ticket);
    }
  } catch (error) {
    logger.error("Error al comprar carrito en controlador")
    next(error);
  }
};

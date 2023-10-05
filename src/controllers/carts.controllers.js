import * as service from "../services/carts.services.js";
import { HttpResponse } from "../utils/http.response.js";

const httpResponse = new HttpResponse();


export const getCartByIdCtr = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const item = await service.getCartByIdService(cartId);
    if (!item) return httpResponse.NotFound(res, "Carrito no encontrado");

    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const getAllCartsCtr = async (req, res, next) => {
  try {
    const items = await service.getAllCartsService();
    res.json(items);
  } catch (error) {
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
    next(error);
  }
};

export const updateCartController = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { product } = req.body;
    await service.getCartByIdService(cartId);
    const docUpd = await service.updateCartService(cartId, {
      product,
    });
    res.json(docUpd);
  } catch (error) {
    next(error);
  }
};

export const deleteCartCtr = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    await service.deleteCartService(cartId);
    return httpResponse.Ok(res, "Item eliminado");
  } catch (error) {
    next(error);
  }
};
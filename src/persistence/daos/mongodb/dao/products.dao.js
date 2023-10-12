import { ProductsModel } from "../models/products.model.js";
import { CartModel } from "../models/carts.model.js";
import {logger} from "../../../../utils/logger.js";

export default class ProductsDaoMongoDB {
  async addProductToCart(cartId, prodId) {
    try {
      const cart = await CartModel.findById(cartId);
      cart.products.push(prodId);
      cart.save();
    } catch (error) {
      logger.error("Error al agregar un producto al carrito en mongodb")
    }
  }
  async getProductById(id) {
    try {
      const response = await ProductsModel.findById(id)
      return response;
    } catch (error) {
      logger.error("Error al un producto por Id en mongodb")
    }
  }

  async getAllProducts(page = 1, limit = 10) {
    try {
      const response = await ProductsModel.paginate({}, { page, limit });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async createProduct(obj) {
    try {
      const response = await ProductsModel.create(obj);
      return response;
    } catch (error) {
      logger.error("Error al crear un producto en mongodb")
    }
  }

  async updateProduct(id, obj) {
    try {
      await ProductsModel.updateOne({ _id: id }, obj);
      return obj;
    } catch (error) {
      logger.error("Error al actualizar un producto en mongodb")
    }
  }

  async deleteProduct(id) {
    try {
      const response = await ProductsModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      logger.error("Error al eliminar un producto en mongodb")
    }
  }

  async deleteProductCart(cartId, prodId) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error("The cart you are searching for does not exist!");
      }

      const index = cart.products.indexOf(prodId);

      if (index === -1) {
        throw new Error(
          `The product with ID ${prodId} does not exist in the cart!`
        );
      }

      cart.products.splice(index, 1);
      await cart.save();

      return cart;
    } catch (error) {
      logger.error("Error al eliminar un producto de un carrito en mongodb")
    }
  }

  async filtrarPorCategorias(category) { 
    try {
      const response = await ProductsModel.aggregate([ 

        {
          $match: { category: `${category}` }
        }
      ])
      return response;
    } catch (error) {
      logger.error("Error al filtrar productos por categorias en mongodb")
    }
  }

  async ordenarPorPrecios() { 
    try {
      const response = await ProductsModel.aggregate([ 

        {
          $sort: { price: 1 }
        }
      ])
      return response;
    } catch (error) {
      logger.error("Error al ordenar productos por precios en mongodb")
    }
  }

}
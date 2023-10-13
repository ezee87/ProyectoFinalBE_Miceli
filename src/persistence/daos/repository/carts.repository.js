import CartDaoMongoDB from "../mongodb/dao/carts.dao.js";
import factory from "../factory.js";
const { cartManager } = factory;

const cartMongo = new CartDaoMongoDB();

export default class CartRepository {
  constructor() {
    this.dao = cartManager;
  }

  async addProductToCart(cartId, prodId) {
    try {
      const cart = await cartMongo.getCartById(cartId);
      cart.products.push(prodId);
      cart.save();
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(id) {
    try {
      const cart = await this.dao.getById(id);
      if (!cart) {
        throw new Error("No se pudo encontrar el carrito por su Id");
      }
      return cart; 
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

}
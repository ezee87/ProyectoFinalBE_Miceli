import factory from "../factory.js";
const { productManager } = factory;
import ProductRegisterDTO from "../../dtos/products/products.register.js";
import ProductResponseDTO from "../../dtos/products/products.response.js";

export default class ProductRepository {
  constructor() {
    this.dao = productManager;
  }

  async getProdById(id) {
    try {
      const product = await this.dao.getById(id);
      if (!product) {
        throw new Error("No se pudo encontrar el producto por su Id");
      }
      const prodDTO = new ProductResponseDTO(product);
      return prodDTO;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await this.dao.getById(id);
      if (!product) {
        throw new Error("No se pudo encontrar el producto por su Id");
      }
      return product; 
    } catch (error) {
      throw error;
    }
  }
  
  async createProd(obj) {
    try {
      const objDTO = new ProductRegisterDTO(obj);
      const response = await this.dao.create(objDTO);
      return response;
    } catch (error) {
    }
  }
}
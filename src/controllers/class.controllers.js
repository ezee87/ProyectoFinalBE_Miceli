import {logger} from "../utils/logger.js"
import { HttpResponse } from "../utils/http.response.js";
const httpResponse = new HttpResponse();

export default class Controllers {
  constructor(service) {
    this.service = service;
  }
  getAll = async (req, res, next) => {
    try {
      const items = await this.service.getAll();
      return httpResponse.Ok(res, items);
    } catch (error) {
      logger.error("Error al traer elementos en class.controllers.js")
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await this.service.getById(id);
      if (!item) return httpResponse.NotFound(res, "Item no encontrado!");
      else return httpResponse.Ok(res, item);
    } catch (error) {
      logger.error("Error al traer elementos por Id en class.controllers.js")
      next(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const newItem = await this.service.create(req.body);
      if (!newItem) return httpResponse.NotFound(res, "Validacion erronea");
      else return httpResponse.Ok(res, newItem)
    } catch (error) {
      logger.error("Error al crear elementos en class.controllers.js")
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      let item = await this.service.getById(id);
      if (!item) return httpResponse.NotFound(res, "Item no encontrado");
      const itemUpdated = await this.service.update(id, req.body);
      return httpResponse.Ok(res, itemUpdated);
    } catch (error) {
      logger.error("Error al actualizar elementos en class.controllers.js")
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await this.service.getById(id);
      if (!item) return httpResponse.Ok(res, item);
      await this.service.delete(id);
      return httpResponse.Ok(res, "Item eliminado");
    } catch (error) {
      logger.error("Error al eliminar elementos en class.controllers.js")
      next(error.message);
    }
  };
}
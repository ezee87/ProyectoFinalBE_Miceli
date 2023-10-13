import {
    getAllService,
    getByIdService,
    createService,
    updateService,
    deleteService,
  } from "../services/messages.services.js";
  import {logger} from "../utils/logger.js"
  
  export const getAllController = async (req, res, next) => {
    try {
      const docs = await getAllService();
      res.json(docs);
    } catch (error) {
      logger.error("Error al traer messages en controlador")
      next(error);
    }
  };
  
  export const getByIdController = async (req, res, next) => {
    try {
      const { id } = req.params;
      const doc = await getByIdService(id);
      res.json(doc);
    } catch (error) {
      logger.error("Error al traer messages por Id en controlador")
      next(error);
    }
  };
  
  export const createController = async (req, res, next) => {
    try {
      const { name, description, price, stock } = req.body;
      const newDoc = await createService({
        name,
        description,
        price,
        stock,
      });
      res.json(newDoc);
    } catch (error) {
      logger.error("Error al crear messages en controlador")
      next(error);
    }
  };
  
  export const updateController = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, price, stock } = req.body;
      await getByIdService(id);
      const docUpd = await updateService(id, {
        name,
        description,
        price,
        stock,
      });
      res.json(docUpd);
    } catch (error) {
      logger.error("Error al actualizar messages en controlador")
      next(error);
    }
  };
  
  export const deleteController = async (req, res, next) => {
    try {
      const { id } = req.params;
      await deleteService(id);
      res.json({ message: "El mensaje se elimino correctamente!" });
    } catch (error) {
      logger.error("Error al eliminar messages en controlador")
      next(error);
    }
  };
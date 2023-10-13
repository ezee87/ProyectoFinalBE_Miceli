import MessagesDaoMongoDB from "../daos/mongodb/messages.dao.js";
const MessageDao = new MessagesDaoMongoDB();
import {logger} from "../utils/logger.js"

export const getAllService = async () => {
    try {
        const docs = await MessageDao.getAllMessages();
        return docs;
    } catch (error) {
        logger.error("Error en el servicio de traer todos los messages")
    }
};

export const getByIdService = async (id) => {
    try {
        const doc = await MessageDao.getMessageById(id);
        if (!doc) throw new Error("No se pudo encontrar el mensaje");
        else return doc;
    } catch (error) {
        logger.error("Error en el servicio de traer messages por Id")
    }
};

export const createService = async (obj) => {
    try {
        const newProd = await MessageDao.createMessage(obj);
        if (!newProd) throw new Error("No se pudo crear el mensaje. Validacion incorrecta.");
        else return newProd;
    } catch (error) {
        logger.error("Error en el servicio de crear messages")
    }
};

export const updateService = async (id, obj) => {
    try {
        const doc = await MessageDao.getMessageById(id);
        if (!doc) {
            throw new Error("No se pudo actualizar el mensaje");
        } else {
            const MessageUpd = await MessageDao.updateMessage(id, obj);
            return MessageUpd;
        }
    } catch (error) {
        logger.error("Error en el servicio de actualizar messages")
    }
};

export const deleteService = async (id) => {
    try {
        const MessageDel = await MessageDao.deleteMessage(id);
        return MessageDel;
    } catch (error) {
        logger.error("Error en el servicio de eliminar messages")
    }
};
import mongoose from 'mongoose';
import config from '../config.js'
import { logger } from '../utils/logger.js'

let MONGO_URL = '';

switch (config.NODE_ENV) {
    case 'dev':
        MONGO_URL = config.MONGO_LOCAL;
        logger.info("Entorno de producción dev");
        break;
    case 'qa':
        MONGO_URL = config.MONGO_QA;
        logger.info("Entorno de producción qa");
        break;
    case 'prod':
        MONGO_URL = config.MONGO_PROD;
        logger.info("Entorno de producción prod");
        break;
    default:
        MONGO_URL = config.MONGO_PROD;
        logger.info("Entorno de producción prod");
        break;
}

// Configura strictQuery aquí antes de conectar a la base de datos
mongoose.set('strictQuery', false);

try {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
} catch (error) {
    logger.error("Error al conectar al servidor Mongoose");
}

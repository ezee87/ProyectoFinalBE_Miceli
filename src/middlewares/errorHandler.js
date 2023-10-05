import { logger } from "../utils/logger.js";
import { createResponse } from "../utils.js";

export const errorHandler = (error, req, res, next) => {
  logger.error(`error ${error.message}`);
  const status = error.status;
  createResponse(res, status, error.message);
  // res.status(status).send(error.message)
};
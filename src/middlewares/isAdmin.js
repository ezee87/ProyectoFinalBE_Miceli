import factory from "../persistence/daos/factory.js";
import { logger } from "../utils/logger.js";
const { userManager } = factory;

export const isAdmin = async (req, res, next) => {
  try {
    const isLoggedIn = req.session;
    if (isLoggedIn) {
      const user = await userManager.getById(req.session.user);
      if (user.role === "admin") {
        next();
      } else {
        res.status(403).json({
          message: "Endpoint no accesible como Admin.",
        })
      }
    } else {
      res.status(400).json({
        message: "Este endpoint esta protegido por Roles."
      });
    }
  } catch (err) {
    logger.error(err);
  }
};
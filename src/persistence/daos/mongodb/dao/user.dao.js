import { userModel } from '../models/user.model.js'
import { createHash, isValidPassword } from '../../../../utils.js';
import {logger} from "../../../../utils/logger.js";

export default class UserDao {
  async createUser(user) {
    try {
      const { email, password } = user;
      const existUser = await userModel.findOne({email});
      if(!existUser){
        if(email === 'adminCoder@coder.com' && password === 'adminCoder123'){
          const newUser = await userModel.create({...user, password: createHash(password), role: 'admin'})
          return newUser;
        } else {
          const newUser = await userModel.create({...user, password: createHash(password)})
          return newUser;
        }
      } else {
        return false;
      }
    } catch (error) {
      logger.error("Error al crear un usuario en mongodb")
      throw new Error(error)
    }
  }

  async loginUser(user) {
    try {
        const { email, password } = user;
        let userExist = await this.getByEmail(email); 
        if (userExist) {
            const passValid = isValidPassword(userExist, password);
            if (!passValid) return false;
            
            // Actualiza la fecha de última conexión y guarda el usuario
            userExist.lastConnection = new Date();
            userExist = await userExist.save();

            return userExist;
        }
        return false;
    } catch (error) {
        logger.error("Error al ingresar con un usuario en MongoDB");
        throw new Error(error);
    }
}

  async getById(id) {
    try {
      const userExist = await userModel.findById(id);
      if (userExist) {
        return userExist;
      }
      return false;
    } catch (error) {
      logger.info(error);
    }
  }

  async getByEmail(email){
    try {
      const userExist = await userModel.findOne({email}); 
      if(userExist){
       return userExist
      } return false
    } catch (error) {
      logger.error("Error al traer un usuario por Email en mongodb")
      throw new Error(error)
    }
  }

  async updateRole(id, newRole) {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(id, { role: newRole }, { new: true });
      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  
  async deleteInactiveUsers() {
    try {
        // Calcular la fecha de hace 30 días
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Buscar y eliminar usuarios inactivos
        const result = await userModel.deleteMany({ lastConnection: { $lt: thirtyDaysAgo } });

        return result.deletedCount;
    } catch (error) {
        throw new Error(error);
    }
}


}
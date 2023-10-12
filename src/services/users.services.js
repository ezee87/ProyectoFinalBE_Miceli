import Services from "./class.services.js";
import factory from '../persistence/daos/factory.js';
import {logger} from "../utils/logger.js"

const { userManager } = factory;

export default class UserService extends Services {
  constructor(){
    super(userManager)
  }

  register = async (user) => {
    try {
      const token = await this.manager.register(user);
      return token;
    } catch (error) {
      logger.error("Error en el servicio de register user")
    }
  };

  login = async (user) => {
    try {
      const userExist = await this.manager.login(user);
      return userExist;
    } catch (error) {
      logger.error("Error en el servicio de login user")
    }
  };

  
updatePassService = async (email) => {
  try { 
      const updatePass = await this.manager.updatePass(email);
      return updatePass
  } catch (error) {
      logger.error(error.message)
      throw new Error(error)
  }
}

updateStatusService = async (uid, role) => {
  try {
      const user = await this.manager.getById(uid);
      if(!user) {
          throw new Error('User not found')
      }
console.log(user)
      if(role === 'premium'){
          user.prodCreator = true;
          await user.save()
      }

      const updatedRole = await this.manager.updateRole(uid, role);
      return updatedRole
      
  } catch (error) {
      logger.error(error.message);
      throw error
  }
};

}

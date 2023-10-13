import MongoDao from "../dao/mongo.dao.js";
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../../../../utils.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = "1234";

export default class UserManagerMongo extends MongoDao {
  constructor() {
    super(userModel);
  }

  #generateToken(user) {
    const payload = {
      userId: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
    };
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "20m",
    });
    return token;
  }

  async register(user) {
    try {
      const { email, password } = user;
      const existUser = await this.model.findOne({ email });
      if (!existUser) {
        const newUser = await this.model.create({
          ...user,
          password: createHash(password),
        });
        const token = this.#generateToken(newUser);
        return token;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async login(user) {
    try {
      const { email, password } = user;
      const userExist = await this.getByEmail(email);
      if (userExist) {
        const passValid = isValidPassword(userExist, password);
        if (!passValid) return false;
        else {
          const token = this.#generateToken(userExist);
          return token;
        }
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  async getByEmail(email) {
    try {
      const userExist = await this.model.findOne({ email });
      if (userExist) {
        return userExist;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const userExist = await this.model.findOne({ id });
       console.log('usuario:', userExist);
      if (userExist) {
        return userExist;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }


async updatePass (uid, password) {
  try {
    await this.model.updateOne({ _id: uid }, { password: password })
    return password
  } catch (error) {
    throw new Error(error)
  }  
}

async updateRole(uid, newRole) {
  try {
    await this.model.updateOne({ _id: uid }, { role: newRole });
    return newRole;
  } catch (error) {
    throw new Error(error);
  }
}

async deleteInactiveUsers() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
console.log(thirtyDaysAgo)
console.log(lastConnection)
    const result = await this.model.deleteMany({ lastConnection: { $lt: thirtyDaysAgo } });

    return result.deletedCount;
  } catch (error) {
    throw new Error(error);
  }
}

}
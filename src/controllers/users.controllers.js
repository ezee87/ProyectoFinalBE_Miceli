import UserDao from "../persistence/daos/mongodb/dao/user.dao.js";
import { generateToken } from "../jwt/auth.js";
import { HttpResponse } from "../utils/http.response.js";
import { transporter, updatePassEmail } from "../services/email.services.js";
import UserService from "../services/users.services.js";
import { createHash, isValidPassword } from '../utils.js';
import MongoDao from "../persistence/daos/mongodb/dao/mongo.dao.js";
import { userModel } from "../persistence/daos/mongodb/models/user.model.js";
import multer from "multer";
import { __dirname } from "../utils.js";

const httpResponse = new HttpResponse();
const userService = new UserService();
const userDao = new UserDao();
const userMongoDao = new MongoDao(userModel);

export const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exist = await userDao.getByEmail(email);
        if (exist) return httpResponse.NotFound(res, "Ya existe el usuario!");
        const user = { first_name, last_name, email, age, password,  lastConnection: new Date() }
        const newUser = await userDao.createUser(user);
        const token = generateToken(newUser);
        return httpResponse.Ok(res, token);
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userDao.loginUser({ email, password });
        if (!user) {
            return httpResponse.NotFound(res, "Credenciales invalidas");
        }

        user.lastConnection = new Date();
        await user.save();

        const access_token = generateToken(user)
        res
            .header('Authorization', access_token)
            .json({ msg: 'Login OK', access_token })
    } catch (error) {
        next(error);
    }
}

export const privateRoute = async (req, res) => {
    const { first_name, last_name, email, role } = req.user;
    res.json({
        status: 'success',
        userData: {
            first_name,
            last_name,
            email,
            role
        }
    })
}

export const loginFront = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userDao.loginUser({ email, password });
        if (!user) {
            return httpResponse.NotFound(res, "Credenciales invalidas");
        }
        const access_token = generateToken(user)
        res
            .cookie('token', access_token,
                { httpOnly: true }
            )
            .json({ msg: 'Login OK', access_token })
    } catch (error) {
        next(error);
    }
}

export const registerResponse = (req, res, next) => {
    try {
        res.json({
            msg: 'Register OK',
            session: req.session    // --> passport.user: id mongo
        })
    } catch (error) {
        next(error);
    }
};

export const loginResponse = async (req, res, next) => {
    try {
        const user = await userDao.getById(req.session.passport.user);
        const { first_name, last_name, email, age, role } = user;
        res.json({
            msg: 'Login OK',
            session: req.session,
            userData: {
                first_name,
                last_name,
                email,
                age,
                role
            }
        })
    } catch (error) {
        next(error);
    }
}

export const githubResponse = async (req, res, next) => {
    try {
        const { first_name, last_name, email, role, isGithub } = req.user;
        res.json({
            msg: 'Register/Login Github OK',
            session: req.session,
            userData: {
                first_name,
                last_name,
                email,
                role,
                isGithub
            }
        })
    } catch (error) {
        next(error);
    }
}

export const updatePassController = async (req, res) => {
    const email = req.body.email;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
        return res.send('New and confirmation password do not match');
    }
    try {
        const user = await userDao.getByEmail(email);
        if (!user) {
            return res.status(404).send('User not found');
        }
        if (!isValidPassword(user, currentPassword)) {
            console.log(user, currentPassword);
            console.log('User password:', user.password);
            console.log('Current password:', currentPassword);
            return res.send('Incorrect current password')

        }
        const newPassHash = createHash(newPassword);
        await userMongoDao.update(user._id, { password: newPassHash });
        res.send('Password updated successfully');
    } catch (error) {
        throw new Error(error);
    }
};

export const updatePassEmailController = async (req, res) => {
    try {
        const response = await transporter.sendMail(updatePassEmail)
        res.json(response)
    } catch (error) {
        throw new Error(error)
    }
};

export const updateStatusController = async (req, res, next) => {
    try {
  
        const { uid } = req.params;
        const user = await userDao.getById(uid)
        console.log(user, 'rol antes de enviar la solicitud:',user.role)
        const newRole = user.role === 'user' ? 'premium' : 'user';
        const updatedRole = await userService.updateStatusService(uid, newRole);
        console.log('nuevo rol despues la solicitud:', user.role)
        res.json({ message: 'Role updated successfully', newRole: updatedRole});
  
    } catch (error) {
        
    
    }
  };

  export const deleteInactiveUsersController = async (req, res, next) => {
    try {
        console.log("Ejecutando deleteInactiveUsersController");
        
        const deletedCount = await userDao.deleteInactiveUsers();
        console.log(`${deletedCount} usuarios inactivos eliminados`);
        
        res.json({ message: `${deletedCount} usuarios inactivos eliminados` });
    } catch (error) {
        next(error);
    }
};


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadDir;
    
        if (file.fieldname === 'profileImage') {
          uploadDir = __dirname + '/public/profiles';
        } else if (file.fieldname === 'productImage') {
          uploadDir = __dirname + '/public/products';
        } else if (file.fieldname === 'documentFile') {
          uploadDir = __dirname + '/public/documents';
        } else {
          uploadDir = __dirname + '/public/unknown';
        }
    
        cb(null, uploadDir);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
      },
  });
    
  export const multerField = multer({ storage });
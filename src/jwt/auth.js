import jwt from 'jsonwebtoken';
import UserDao from '../persistence/daos/mongodb/dao/user.dao.js';
const userDao = new UserDao();

const PRIVATE_KEY = '1234';

export const generateToken = (user) =>{
    const payload = {
        userId: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age
    };

    const token = jwt.sign(payload, PRIVATE_KEY, {
        expiresIn: '15m'
    });
    return token;
};

export const checkAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if(!authHeader) return res.status(401).json({ msg: 'Unauthorized uno' });
        const token = authHeader.split(' ')[1];
        const decode = jwt.verify(token, PRIVATE_KEY);
        const user = await userDao.getById(decode.userId);
        if(!user) return res.status(401).json({ msg: 'Unauthorized dos' });
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }

}
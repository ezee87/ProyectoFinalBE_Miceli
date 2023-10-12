import { Router } from 'express'
import UserDao from '../persistence/daos/mongodb/dao/user.dao.js'
import { checkAuth } from '../jwt/auth.js';
import { registerResponse, loginResponse, loginFront, githubResponse, register, login, updatePassController, updateStatusController,updatePassEmailController, deleteInactiveUsersController } from '../controllers/users.controllers.js';
import passport from 'passport';
import { multerField } from '../controllers/users.controllers.js';

const userDao = new UserDao()
const router = Router()

router.post("/register", register);

router.post("/login", login);

router.post("/loginfront", loginFront);

router.post('/register-local', passport.authenticate('register'), registerResponse);

router.post('/login-local', passport.authenticate('login'), loginResponse);

router.get('/private', checkAuth, (req, res)=>{
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
});

router.get('/register-github', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/profile-github', passport.authenticate('github', { scope: [ 'user:email' ] }), githubResponse);

router.get('/current', passport.authenticate('jwt'),  (req, res) => {
  res.send(req.user);
});

router.post('/changePassword' , updatePassEmailController)
router.post('/updatePass', updatePassController);
router.put('/premium/:uid', updateStatusController);
router.delete('/delete', deleteInactiveUsersController);

router.post('/:uid/documents', multerField.single('documentFile'), async (req, res) => {
  try {
    const { uid } = req.params;
    const { file } = req;
    if (!file) {
      return res.status(400).json({ msg: 'No file available' });
    };
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: uid },
      {
        $push: {
          documents: {
            name: file.originalname,
            reference: file.filename,
          },
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ msg: 'User not found' })
    };
    res.status(201).json({ msg: 'Document updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ msg: 'Error uploading document' });
  }
});

export default router
import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import UsersController from '../controllers/UsersController';
import ensureAuthenticad from '../middlewares/ensureAuthenticated';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

usersRouter.post('/', usersController.create);

/* Atualizar uma única informação do usuário */
usersRouter.patch(
  '/avatar',
  ensureAuthenticad,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRouter;

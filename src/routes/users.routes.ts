import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import ensureAuthenticad from '../middlewares/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    /* Deletando o password da resposta */
    delete user.password;

    return response.json(user);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

/* Atualizar uma única informação do usuário */
usersRouter.patch(
  '/avatar',
  ensureAuthenticad,
  upload.single('avatar'),
  async (request, response) => {
    return response.json({ ok: true });
  },
);

export default usersRouter;

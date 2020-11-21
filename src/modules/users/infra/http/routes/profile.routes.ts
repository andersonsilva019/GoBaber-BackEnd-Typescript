import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import ensureAuthenticad from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticad);
profileRouter.put('/', profileController.update);
profileRouter.get('/', profileController.show);

export default profileRouter;

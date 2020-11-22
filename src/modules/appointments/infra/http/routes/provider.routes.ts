import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProviderController from '../controllers/ProviderController';

const providerRouter = Router();
const listProviders = new ProviderController();

providerRouter.use(ensureAuthenticated);

providerRouter.get('/', listProviders.index);

export default providerRouter;

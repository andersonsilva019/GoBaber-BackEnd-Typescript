import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderService from '@modules/appointments/services/ListProviderService';

export default class ProviderController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listProvider = container.resolve(ListProviderService);

    const providers = await listProvider.execute({
      user_id,
    });

    return response.json(providers);
  }
}

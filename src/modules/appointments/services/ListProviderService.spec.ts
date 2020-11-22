// import AppError from '@shared/errors/AppError';
import FakerUserRepository from '@modules/users/repositories/fakes/FakerUserRepository';
import ListProviderService from './ListProviderService';

let fakerUserRepository: FakerUserRepository;
let listProviders: ListProviderService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakerUserRepository = new FakerUserRepository();
    listProviders = new ListProviderService(fakerUserRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    const user2 = await fakerUserRepository.create({
      name: 'John Doe 2',
      email: 'johndoe2@johndoe.com',
      password: '12345678',
    });

    const loggedUser = await fakerUserRepository.create({
      name: 'John Doe 3',
      email: 'johndoe3@johndoe.com',
      password: '12345678',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});

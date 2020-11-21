import AppError from '@shared/errors/AppError';
import FakerUserRepository from '../repositories/fakes/FakerUserRepository';
import FakerHashProvider from '../providers/HashProvider/fakes/FakerHashProvider';
import CreateUserService from './CreateUserService';

let fakerUserRepository: FakerUserRepository;
let fakerHashProvider: FakerHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakerUserRepository = new FakerUserRepository();
    fakerHashProvider = new FakerHashProvider();
    createUser = new CreateUserService(fakerUserRepository, fakerHashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Anderson Silva',
      email: 'anderson@anderson.com',
      password: '12345678',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'Anderson Silva',
      email: 'anderson@anderson.com',
      password: '12345678',
    });

    await expect(
      createUser.execute({
        name: 'Anderson Silva',
        email: 'anderson@anderson.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

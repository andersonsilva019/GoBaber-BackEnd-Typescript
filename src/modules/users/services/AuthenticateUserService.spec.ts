import AppError from '@shared/errors/AppError';
import FakerUserRepository from '../repositories/fakes/FakerUserRepository';
import FakerHashProvider from '../providers/HashProvider/fakes/FakerHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakerUserRepository: FakerUserRepository;
let fakerHashProvider: FakerHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakerUserRepository = new FakerUserRepository();
    fakerHashProvider = new FakerHashProvider();

    createUser = new CreateUserService(fakerUserRepository, fakerHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakerUserRepository,
      fakerHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'Anderson Silva',
      email: 'anderson@anderson.com',
      password: '12345678',
    });

    const response = await authenticateUser.execute({
      email: 'anderson@anderson.com',
      password: '12345678',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with none existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'anderson@anderson.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'Anderson Silva',
      email: 'anderson@anderson.com',
      password: '12345678',
    });

    await expect(
      authenticateUser.execute({
        email: 'anderson@anderson.com',
        password: '123456789abc',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

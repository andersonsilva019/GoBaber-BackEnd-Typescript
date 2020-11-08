import AppError from '@shared/errors/AppError';
import FakerUserRepository from '../repositories/fakes/FakerUserRepository';
import FakerHashProvider from '../providers/HashProvider/fakes/FakerHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakerUserRepository = new FakerUserRepository();
    const fakerHashProvider = new FakerHashProvider();

    const createUser = new CreateUserService(
      fakerUserRepository,
      fakerHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakerUserRepository,
      fakerHashProvider,
    );

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
    const fakerUserRepository = new FakerUserRepository();
    const fakerHashProvider = new FakerHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakerUserRepository,
      fakerHashProvider,
    );

    expect(
      authenticateUser.execute({
        email: 'anderson@anderson.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakerUserRepository = new FakerUserRepository();
    const fakerHashProvider = new FakerHashProvider();

    const createUser = new CreateUserService(
      fakerUserRepository,
      fakerHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakerUserRepository,
      fakerHashProvider,
    );

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

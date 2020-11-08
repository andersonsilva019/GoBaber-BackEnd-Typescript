import AppError from '@shared/errors/AppError';
import FakerUserRepository from '../repositories/fakes/FakerUserRepository';
import FakerHashProvider from '../providers/HashProvider/fakes/FakerHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakerUserRepository = new FakerUserRepository();
    const fakerHashProvider = new FakerHashProvider();
    const createUser = new CreateUserService(
      fakerUserRepository,
      fakerHashProvider,
    );

    const user = await createUser.execute({
      name: 'Anderson Silva',
      email: 'anderson@anderson.com',
      password: '12345678',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakerUserRepository = new FakerUserRepository();
    const fakerHashProvider = new FakerHashProvider();
    const createUser = new CreateUserService(
      fakerUserRepository,
      fakerHashProvider,
    );

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

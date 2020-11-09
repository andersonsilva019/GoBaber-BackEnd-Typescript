import AppError from '@shared/errors/AppError';
import FakerUserRepository from '../repositories/fakes/FakerUserRepository';
import FakerUserTokenRepository from '../repositories/fakes/FakerUserTokenRepository';
import ResetPasswordService from './ResetPasswordService';
import FakerHashProvider from '../providers/HashProvider/fakes/FakerHashProvider';

let fakerUserRepository: FakerUserRepository;
let fakerUserTokenRepository: FakerUserTokenRepository;
let fakerHashProvider: FakerHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  // Antes de cada teste, execute...
  beforeEach(() => {
    fakerUserRepository = new FakerUserRepository();
    fakerUserTokenRepository = new FakerUserTokenRepository();
    fakerHashProvider = new FakerHashProvider();

    resetPassword = new ResetPasswordService(
      fakerUserRepository,
      fakerUserTokenRepository,
      fakerHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    const { token } = await fakerUserTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakerHashProvider, 'generateHash');

    await resetPassword.execute({
      token,
      password: '123456789',
    });

    const updatedUser = await fakerUserRepository.findById(user.id);
    expect(generateHash).toBeCalledWith('123456789');
    expect(updatedUser?.password).toBe('123456789');
  });

  it('should not be able to reset password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password with non-existing user', async () => {
    const { token } = await fakerUserTokenRepository.generate(
      'non-existing-user',
    );

    await expect(
      resetPassword.execute({
        token,
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password is passed more than 2 hours', async () => {
    const user = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    const { token } = await fakerUserTokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        token,
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import AppError from '@shared/errors/AppError';
import FakerUserRepository from '../repositories/fakes/FakerUserRepository';
import FakerUserTokenRepository from '../repositories/fakes/FakerUserTokenRepository';
import ResetPasswordService from './ResetPasswordService';

let fakerUserRepository: FakerUserRepository;
let fakerUserTokenRepository: FakerUserTokenRepository;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  // Antes de cada teste, execute...
  beforeEach(() => {
    fakerUserRepository = new FakerUserRepository();
    fakerUserTokenRepository = new FakerUserTokenRepository();

    resetPassword = new ResetPasswordService(
      fakerUserRepository,
      fakerUserTokenRepository,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    const { token } = await fakerUserTokenRepository.generate(user.id);

    await resetPassword.execute({
      token,
      password: '123456789',
    });

    const updatedUser = await fakerUserRepository.findById(user.id);

    expect(updatedUser?.password).toBe('123456789');
  });
});

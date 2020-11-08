// import AppError from '@shared/errors/AppError';
import FakerMailProvider from '@shared/container/providers/MailProvider/fakes/FakerMailProvider';
import AppError from '@shared/errors/AppError';
import FakerUserRepository from '../repositories/fakes/FakerUserRepository';
import FakerUserTokenRepository from '../repositories/fakes/FakerUserTokenRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakerUserRepository: FakerUserRepository;
let fakerMailProvider: FakerMailProvider;
let fakerUserTokenRepository: FakerUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  // Antes de cada teste, execute...
  beforeEach(() => {
    fakerUserRepository = new FakerUserRepository();
    fakerMailProvider = new FakerMailProvider();
    fakerUserTokenRepository = new FakerUserTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakerUserRepository,
      fakerMailProvider,
      fakerUserTokenRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakerMailProvider, 'sendMail');
    await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@johndoe.com',
    });

    expect(sendMail).toBeCalled();
  });

  it('should not be able to recover a not-existing user passowrd', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'johndoe@johndoe.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot passoword token', async () => {
    const generateToken = jest.spyOn(fakerUserTokenRepository, 'generate');

    const user = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@johndoe.com',
    });

    expect(generateToken).toBeCalledWith(user.id);
  });
});

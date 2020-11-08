// import AppError from '@shared/errors/AppError';
import FakerMailProvider from '@shared/container/providers/MailProvider/fakes/FakerMailProvider';
import FakerUserRepository from '../repositories/fakes/FakerUserRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotPasswordEmail', () => {
  it('should be able to recover the password using the email', async () => {
    const fakerUserRepository = new FakerUserRepository();
    const fakerMailProvider = new FakerMailProvider();

    const sendMail = jest.spyOn(fakerMailProvider, 'sendMail');

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakerUserRepository,
      fakerMailProvider,
    );

    await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@johndoe.com',
    });

    // expect(user).toHaveProperty('id');
    expect(sendMail).toBeCalled();
  });
});

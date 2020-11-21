// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import FakerHashProvider from '../providers/HashProvider/fakes/FakerHashProvider';
import FakerUserRepository from '../repositories/fakes/FakerUserRepository';
import UpdateProfileService from './UpdateProfileService';

let fakerUserRepository: FakerUserRepository;
let fakerHashProvider: FakerHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakerUserRepository = new FakerUserRepository();
    fakerHashProvider = new FakerHashProvider();
    updateProfile = new UpdateProfileService(
      fakerUserRepository,
      fakerHashProvider,
    );
  });

  it('should be able update the profile', async () => {
    const user = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    const updatedUSer = await updateProfile.execute({
      user_id: user.id,
      name: 'John Doe 2',
      email: 'johndoe2@gmail.com',
    });

    expect(updatedUSer.name).toBe('John Doe 2');
    expect(updatedUSer.email).toBe('johndoe2@gmail.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    const user = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'teste@johndoe.com',
      password: '12345678',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe 2',
        email: 'johndoe@johndoe.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    const updatedUSer = await updateProfile.execute({
      user_id: user.id,
      name: 'John Doe 2',
      email: 'johndoe2@gmail.com',
      old_password: '12345678',
      password: '123123',
    });

    expect(updatedUSer.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe 2',
        email: 'johndoe2@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe 2',
        email: 'johndoe2@gmail.com',
        old_password: '123456789',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

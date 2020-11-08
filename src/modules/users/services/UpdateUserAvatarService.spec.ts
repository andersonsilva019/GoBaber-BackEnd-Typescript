import AppError from '@shared/errors/AppError';
import FakerStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakerStorageProvider';
import FakerUserRepository from '../repositories/fakes/FakerUserRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to create a new user', async () => {
    const fakerUserRepository = new FakerUserRepository();
    const fakerStorageProvider = new FakerStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(
      fakerUserRepository,
      fakerStorageProvider,
    );

    const user = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    const fakerUserRepository = new FakerUserRepository();
    const fakerStorageProvider = new FakerStorageProvider();
    const updateUserAvatar = new UpdateUserAvatarService(
      fakerUserRepository,
      fakerStorageProvider,
    );

    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const fakerUserRepository = new FakerUserRepository();
    const fakerStorageProvider = new FakerStorageProvider();

    // Verifica se o método 'deleteFile' foi chamado
    const deleteFile = jest.spyOn(fakerStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakerUserRepository,
      fakerStorageProvider,
    );

    const user = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'novo-avatar.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('novo-avatar.jpg');
  });
});

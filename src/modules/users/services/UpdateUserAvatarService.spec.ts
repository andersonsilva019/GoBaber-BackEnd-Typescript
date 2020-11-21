import AppError from '@shared/errors/AppError';
import FakerStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakerStorageProvider';
import FakerUserRepository from '../repositories/fakes/FakerUserRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakerUserRepository: FakerUserRepository;
let fakerStorageProvider: FakerStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakerUserRepository = new FakerUserRepository();
    fakerStorageProvider = new FakerStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakerUserRepository,
      fakerStorageProvider,
    );
  });

  it('should be able to create a new user', async () => {
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
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    // Verifica se o método 'deleteFile' foi chamado
    const deleteFile = jest.spyOn(fakerStorageProvider, 'deleteFile');

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

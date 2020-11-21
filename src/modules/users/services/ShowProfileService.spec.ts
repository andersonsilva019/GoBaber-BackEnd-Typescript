// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import FakerUserRepository from '../repositories/fakes/FakerUserRepository';
import ShowProfileService from './ShowProfileService';

let fakerUserRepository: FakerUserRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakerUserRepository = new FakerUserRepository();
    showProfile = new ShowProfileService(fakerUserRepository);
  });

  it('should be able show the profile', async () => {
    const user = await fakerUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '12345678',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@johndoe.com');
  });

  it('should not be able show the profile from non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

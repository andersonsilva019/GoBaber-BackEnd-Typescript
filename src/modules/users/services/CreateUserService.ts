import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import AppError from '../../../shared/errors/AppError';

import User from '../entities/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  /* public async execute(data: Request): Promise<void>  */
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExits = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExits) {
      throw new AppError('Email address already used');
    }

    const hashPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;

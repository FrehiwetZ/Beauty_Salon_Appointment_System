import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export const registerUser = async (data: any) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    throw new Error('Email or username already in use');
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  const token = generateToken({ id: user.id, role: user.role });

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const loginUser = async (data: any) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: data.username },
        { email: data.username }
      ]
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Your account has been disabled');
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({ id: user.id, role: user.role });

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      staffProfile: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

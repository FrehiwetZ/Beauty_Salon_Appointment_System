import { prisma } from '../config/database';
import { Role } from '@prisma/client';

export const getAllPosts = async (page: number, limit: number, isPublishedOnly: boolean = true) => {
  const skip = (page - 1) * limit;
  const whereClause: any = isPublishedOnly ? { status: 'APPROVED' } : {};

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      include: {
        author: { select: { firstName: true, lastName: true, role: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.count({ where: whereClause }),
  ]);

  return {
    data: posts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getPostById = async (id: string, isPublishedOnly: boolean = true) => {
  const whereClause: any = { id };
  if (isPublishedOnly) whereClause.status = 'APPROVED';

  const post = await prisma.post.findFirst({
    where: whereClause,
    include: {
      author: { select: { firstName: true, lastName: true, role: true } },
    },
  });

  if (!post) throw new Error('Post not found');
  return post;
};

export const createPost = async (authorId: string, data: any) => {
  return prisma.post.create({
    data: {
      ...data,
      authorId,
      status: 'APPROVED',
    },
  });
};

export const updatePost = async (id: string, authorId: string, role: string, data: any) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error('Post not found');

  if (role !== Role.ADMIN && post.authorId !== authorId) {
    throw new Error('Unauthorized');
  }

  return prisma.post.update({
    where: { id },
    data,
  });
};

export const deletePost = async (id: string, authorId: string, role: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error('Post not found');

  if (role !== Role.ADMIN && post.authorId !== authorId) {
    throw new Error('Unauthorized');
  }

  return prisma.post.delete({
    where: { id },
  });
};

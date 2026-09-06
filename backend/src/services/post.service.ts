import { prisma } from '../config/database';
import { Role } from '@prisma/client';

export const getAllPosts = async (page: number = 1, limit: number = 100, isPublishedOnly: boolean = true) => {
  const skip = (page - 1) * limit;
  const whereClause: any = isPublishedOnly ? { status: 'APPROVED' } : {};

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      include: {
        author: { select: { id: true, firstName: true, lastName: true, role: true, email: true } },
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
      author: { select: { id: true, firstName: true, lastName: true, role: true, email: true } },
    },
  });

  if (!post) throw new Error('Post not found');
  return post;
};

export const createPost = async (authorId: string, data: any) => {
  const { title, titleAm, titleOm, content, contentAm, contentOm, imageUrl, status } = data;
  return prisma.post.create({
    data: {
      title,
      titleAm: titleAm || null,
      titleOm: titleOm || null,
      content,
      contentAm: contentAm || null,
      contentOm: contentOm || null,
      imageUrl: imageUrl || null,
      authorId,
      status: status || 'APPROVED',
    } as any,
    include: {
      author: { select: { id: true, firstName: true, lastName: true, role: true, email: true } },
    },
  });
};

export const updatePost = async (id: string, authorId: string, role: string, data: any) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error('Post not found');

  if (role !== Role.ADMIN && post.authorId !== authorId) {
    throw new Error('Unauthorized');
  }

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.titleAm !== undefined) updateData.titleAm = data.titleAm;
  if (data.titleOm !== undefined) updateData.titleOm = data.titleOm;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.contentAm !== undefined) updateData.contentAm = data.contentAm;
  if (data.contentOm !== undefined) updateData.contentOm = data.contentOm;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null;
  if (data.status !== undefined) updateData.status = data.status;

  return prisma.post.update({
    where: { id },
    data: updateData,

    include: {
      author: { select: { id: true, firstName: true, lastName: true, role: true, email: true } },
    },
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


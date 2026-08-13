import { prisma } from '../config/database';

export const getUserNotifications = async (userId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where: { userId } }),
  ]);

  return {
    data: notifications,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const markAsRead = async (id: string, userId: string) => {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) throw new Error('Notification not found');
  if (notification.userId !== userId) throw new Error('Unauthorized');

  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
};

export const markAllAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

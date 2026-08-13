import { prisma } from '../config/database';

export const getAllServices = async (page: number, limit: number, search?: string) => {
  const skip = (page - 1) * limit;

  const whereClause: any = {};
  if (search) {
    whereClause.name = { contains: search, mode: 'insensitive' };
  }

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where: whereClause,
      include: {
        ratings: { select: { score: true } },
      },
      skip,
      take: limit,
    }),
    prisma.service.count({ where: whereClause }),
  ]);

  const formattedServices = services.map((s) => {
    let avgRating = 0;
    if (s.ratings && s.ratings.length > 0) {
      const sum = s.ratings.reduce((acc, r) => acc + r.score, 0);
      avgRating = sum / s.ratings.length;
    }
    const { ratings, ...serviceWithoutRatings } = s;
    return {
      ...serviceWithoutRatings,
      averageRating: avgRating,
    };
  });

  return {
    data: formattedServices,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getServiceById = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      staff: {
        include: {
          staff: {
            include: {
              user: { select: { firstName: true, lastName: true } },
            },
          },
        },
      },
      ratings: { include: { user: { select: { firstName: true, lastName: true } } } },
    },
  });

  if (!service) throw new Error('Service not found');
  return service;
};

export const createService = async (data: any) => {
  return prisma.service.create({ data });
};

export const updateService = async (id: string, data: any) => {
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) throw new Error('Service not found');

  return prisma.service.update({
    where: { id },
    data,
  });
};

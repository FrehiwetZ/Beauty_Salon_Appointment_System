import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { env } from '../src/config/env';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin
  const adminPassword = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
  const admin = await prisma.user.upsert({
    where: { username: env.ADMIN_USERNAME },
    update: {},
    create: {
      email: 'admin@beautysalon.local',
      username: env.ADMIN_USERNAME,
      password: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
    },
  });
  console.log(`Admin user created: ${admin.username}`);

  // 2. Create Example Staff
  const staff1Password = await bcrypt.hash('Staff@123', 10);
  const staff1User = await prisma.user.upsert({
    where: { username: 'janesmith' },
    update: {},
    create: {
      email: 'jane.smith@beautysalon.local',
      username: 'janesmith',
      password: staff1Password,
      firstName: 'Jane',
      lastName: 'Smith',
      role: Role.STAFF,
      staffProfile: {
        create: {
          bio: 'Expert hair stylist with 10 years of experience.',
          position: 'Senior Stylist',
        },
      },
    },
  });

  const staff2Password = await bcrypt.hash('Staff@123', 10);
  const staff2User = await prisma.user.upsert({
    where: { username: 'davidjohnson' },
    update: {},
    create: {
      email: 'david.j@beautysalon.local',
      username: 'davidjohnson',
      password: staff2Password,
      firstName: 'David',
      lastName: 'Johnson',
      role: Role.STAFF,
      staffProfile: {
        create: {
          bio: 'Specialist in massage and facial treatments.',
          position: 'Therapist',
        },
      },
    },
  });
  console.log('Example staff users created.');

  // 3. Create Services
  const haircutService = await prisma.service.create({
    data: {
      name: 'Haircut & Styling',
      description: 'Complete haircut and professional styling.',
      durationMinutes: 60,
      price: 50.0,
    },
  });

  const facialService = await prisma.service.create({
    data: {
      name: 'Deep Cleansing Facial',
      description: 'Rejuvenating facial treatment.',
      durationMinutes: 45,
      price: 70.0,
    },
  });

  const manicureService = await prisma.service.create({
    data: {
      name: 'Manicure',
      description: 'Classic manicure with regular polish.',
      durationMinutes: 30,
      price: 25.0,
    },
  });
  console.log('Example services created.');

  // Assign Services to Staff
  const staff1Profile = await prisma.staffProfile.findUnique({ where: { userId: staff1User.id } });
  const staff2Profile = await prisma.staffProfile.findUnique({ where: { userId: staff2User.id } });

  if (staff1Profile) {
    await prisma.staffService.createMany({
      data: [
        { staffId: staff1Profile.id, serviceId: haircutService.id },
        { staffId: staff1Profile.id, serviceId: manicureService.id },
      ],
      skipDuplicates: true,
    });
  }

  if (staff2Profile) {
    await prisma.staffService.createMany({
      data: [
        { staffId: staff2Profile.id, serviceId: facialService.id },
        { staffId: staff2Profile.id, serviceId: manicureService.id },
      ],
      skipDuplicates: true,
    });
  }
  console.log('Services assigned to staff.');

  // 4. Create Working Hours for Staff 1
  if (staff1Profile) {
    const workingHours = [
      { staffId: staff1Profile.id, dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }, // Monday
      { staffId: staff1Profile.id, dayOfWeek: 2, startTime: '09:00', endTime: '17:00' }, // Tuesday
      { staffId: staff1Profile.id, dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }, // Wednesday
      { staffId: staff1Profile.id, dayOfWeek: 4, startTime: '09:00', endTime: '17:00' }, // Thursday
      { staffId: staff1Profile.id, dayOfWeek: 5, startTime: '09:00', endTime: '15:00' }, // Friday
      { staffId: staff1Profile.id, dayOfWeek: 6, isDayOff: true, startTime: '00:00', endTime: '00:00' }, // Saturday
      { staffId: staff1Profile.id, dayOfWeek: 0, isDayOff: true, startTime: '00:00', endTime: '00:00' }, // Sunday
    ];

    await prisma.workingHour.createMany({
      data: workingHours,
      skipDuplicates: true,
    });
  }
  
  if (staff2Profile) {
    const workingHours2 = [
      { staffId: staff2Profile.id, dayOfWeek: 1, startTime: '10:00', endTime: '18:00' }, 
      { staffId: staff2Profile.id, dayOfWeek: 2, startTime: '10:00', endTime: '18:00' }, 
      { staffId: staff2Profile.id, dayOfWeek: 3, startTime: '10:00', endTime: '18:00' }, 
      { staffId: staff2Profile.id, dayOfWeek: 4, startTime: '10:00', endTime: '18:00' }, 
      { staffId: staff2Profile.id, dayOfWeek: 5, startTime: '10:00', endTime: '18:00' }, 
      { staffId: staff2Profile.id, dayOfWeek: 6, isDayOff: true, startTime: '00:00', endTime: '00:00' }, 
      { staffId: staff2Profile.id, dayOfWeek: 0, isDayOff: true, startTime: '00:00', endTime: '00:00' }, 
    ];

    await prisma.workingHour.createMany({
      data: workingHours2,
      skipDuplicates: true,
    });
  }
  console.log('Working hours assigned.');

  // 5. Create Example Posts
  await prisma.post.create({
    data: {
      authorId: admin.id,
      title: 'Welcome to our New Salon System',
      content: 'We are excited to announce our new online booking system!',
    },
  });
  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import { mockVehicles, mockPackages, mockTourists } from '../features/dashboard/services/data';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({});

async function main() {
  console.log('Memulai proses seeding (memasukkan data mock lengkap ke database)...');

  // Seed Admin account
  await prisma.admin.deleteMany();
  const hashedPassword = await bcrypt.hash('adminLAGROUP', 10);
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: { password: hashedPassword },
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });
  console.log('✅ Admin account seeded (username: admin)');

  // Hapus data lama
  await prisma.vehicle.deleteMany();
  await prisma.tourPackage.deleteMany();
  await prisma.tourist.deleteMany();
  await prisma.googleReview.deleteMany();

  for (const v of mockVehicles) {
    const vehicle = await prisma.vehicle.create({
      data: {
        id: v.id,
        name: v.name,
        type: v.type,
        licensePlate: v.licensePlate || "PLAT-X",
        pricePerDay: v.pricePerDay,
        status: v.status || "available",
        imageUrl: v.imageUrl,
        category: v.category || v.type,
        description: v.description,
        rentalDuration: v.rentalDuration || "Full Day",
        maxSpeed: v.maxSpeed,
        seatCapacity: v.seatCapacity || null,
        selfDrive: v.selfDrive,
        hasPhoneCharger: v.hasPhoneCharger,
        features: v.features ? JSON.stringify(v.features) : null,
        createdAt: v.createdAt ? new Date(v.createdAt) : new Date(),
      },
    });
  }

  for (const t of mockPackages) {
    const tour = await prisma.tourPackage.create({
      data: {
        id: t.id,
        title: t.title,
        titleEn: t.titleEn,
        description: t.description,
        descriptionEn: t.descriptionEn,
        imageUrl: t.imageUrl,
        estimatedPrice: t.estimatedPrice,
        duration: t.duration,
        minPax: t.minPax,
        maxPax: t.maxPax,
        startTime: t.startTime,
        endTime: t.endTime,
        includes: t.includes ? JSON.stringify(t.includes) : null,
        excludes: t.excludes ? JSON.stringify(t.excludes) : null,
        vehicleOptions: t.vehicleOptions ? JSON.stringify(t.vehicleOptions) : null,
        category: t.category,
        priceType: t.priceType,
        destinationTags: t.destinationTags ? JSON.stringify(t.destinationTags) : null,
        status: t.status || "draft",
        recommendation: t.recommendation || null,
      },
    });
  }

  for (const tourist of mockTourists) {
    await prisma.tourist.create({
      data: {
        nationality: tourist.nationality,
        continent: tourist.continent as string,
        packageTaken: tourist.packageTaken,
        photoUrl: tourist.photoUrl,
      }
    });
  }

  // Tambahkan mock reviews
  const mockReviews = [
    { name: "John Doe", country: "United States", rating: 5, comment: "Amazing service! The cars were clean and the tour was perfectly organized." },
    { name: "Sarah Lee", country: "Singapore", rating: 5, comment: "Highly recommend Andika Trans. Very professional and friendly drivers." },
    { name: "Michael Chen", country: "Taiwan", rating: 4, comment: "Great experience overall. The tour guide was very knowledgeable." }
  ];

  for (const review of mockReviews) {
    await prisma.googleReview.create({ data: review });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed StatusTypes
  const statusTypes = [
    { type: 'CHARACTERS' },
    { type: 'EPISODES' }
  ];

  for (const statusType of statusTypes) {
    console.log(`Upserting statusType: ${statusType.type}`);
    await prisma.statusType.upsert({
      where: { type: statusType.type },
      update: {},
      create: statusType,
    });
  }
  

  // Seed Statuses
  const statuses = [
    { name: 'ACTIVE', statusType: 'CHARACTERS' },
    { name: 'SUSPENDED', statusType: 'CHARACTERS' },
    { name: 'CANCELLED', statusType: 'EPISODES' },
    { name: 'ACTIVE', statusType: 'EPISODES' }
  ];

  for (const status of statuses) {
    console.log(`Upserting statusType: ${status.name}`);
    const statusType = await prisma.statusType.findUnique({
      where: { type: status.statusType }
    });

    if (statusType) {
      const existingStatus = await prisma.status.findFirst({
        where: {
          name: status.name,
          statusTypeId: statusType.id
        }
      });

      if (!existingStatus) {
        await prisma.status.create({
          data: {
            name: status.name,
            statusTypeId: statusType.id
          }
        });
      }
    }
  }
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

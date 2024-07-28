import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedStatusTypesAndStatuses() {
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
    console.log(`Upserting status: ${status.name}`);
    const statusType = await prisma.statusType.findUnique({
      where: { type: status.statusType }
    });

    if (statusType) {
      await prisma.status.upsert({
        where: {
          name_statusTypeId: {
            name: status.name,
            statusTypeId: statusType.id
          }
        },
        update: {},
        create: {
          name: status.name,
          statusTypeId: statusType.id
        }
      });
    } else {
      console.error(`StatusType ${status.statusType} not found`);
    }
  }
}

async function seedCategories() {
  // Seed Categories
  const categories = ['SPECIES', 'SEASON'];

  for (const category of categories) {
    console.log(`Upserting category: ${category}`);
    await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    });
  }

  console.log('Categorías insertadas con éxito');
}

async function seedSubcategories() {
  const categoriesMap = new Map<string, number>();
  const categoriesInDb = await prisma.category.findMany();

  for (const category of categoriesInDb) {
    categoriesMap.set(category.name, category.id);
  }

  const characters = await prisma.character.findMany({
    select: { species: true }
  });

  const speciesSet = new Set<string>();

  for (const character of characters) {
    if (character.species) {
      speciesSet.add(character.species);
    }
  }

  // Insert species subcategories
  const speciesArray = Array.from(speciesSet);

  for (const species of speciesArray) {
    const categoryId = categoriesMap.get('SPECIES');
    if (categoryId) {
      console.log(`Upserting subcategory: ${species}`);
      await prisma.subCategory.upsert({
        where: {
          name_categoryId: {
            name: species,
            categoryId: categoryId
          }
        },
        update: {},
        create: {
          name: species,
          categoryId: categoryId
        }
      });
    } else {
      console.error('Category SPECIES not found');
    }
  }

  console.log('Subcategorías insertadas con éxito');

  const episodes = await prisma.episode.findMany({
    select: { episode: true }
  });

  const seasonSet = new Set<string>();

  for (const episode of episodes) {
    if (episode.episode) {
      const season = episode.episode.substring(0, 3);
      if (season.startsWith('S')) {
        seasonSet.add(season);
      }
    }
  }

  const seasonsArray = Array.from(seasonSet);

  for (const season of seasonsArray) {
    const categoryId = categoriesMap.get('SEASON');
    if (categoryId) {
      console.log(`Upserting subcategory: ${season}`);
      await prisma.subCategory.upsert({
        where: {
          name_categoryId: {
            name: season,
            categoryId: categoryId
          }
        },
        update: {},
        create: {
          name: season,
          categoryId: categoryId
        }
      });
    } else {
      console.error('Category SEASON not found');
    }
  }

  console.log('Subcategorías de temporada insertadas con éxito');
}

async function main() {
  await seedStatusTypesAndStatuses();
  await seedCategories();
  await seedSubcategories();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

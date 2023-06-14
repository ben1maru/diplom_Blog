import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


const createCategories = async () => {
  const categories = [
    { name: 'Війна ' },
    { name: 'Здоров`я' },
    { name: 'Програмування' },
    { name: 'Технології' },
  ];

  try {
    await prisma.category.createMany({
      data: categories,
    });

    console.log('Categories created');
  } catch (error) {
    console.error('Failed to create categories', error);
  } finally {
    await prisma.$disconnect();
  }
};

createCategories();

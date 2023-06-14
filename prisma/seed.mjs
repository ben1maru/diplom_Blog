import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser(email, password, name) {
  const user = await prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });

  return user;
}

async function main() {
  try {
    const newUser = await createUser('admins@gmail.com', '$2a$12$wSAQRVUGKuJvjCoi.1AvSedF8Zg4QZWuNbtsp9/OWhKmLN2FdLgAa', 'admin');
    console.log('New user created:', newUser);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

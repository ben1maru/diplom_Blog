import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handleLogin(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    // Перевірка користувача в базі даних
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Користувача не знайдено' });
    }

    // Перевірка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Невірний пароль' });
    }

    // Авторизація успішна
    return res.status(200).json({ message: 'Авторизація успішна' });
  } catch (error) {
    console.error('Помилка авторизації', error);
    return res.status(500).json({ message: 'Помилка авторизації' });
  }
}

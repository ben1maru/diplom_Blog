import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { Post } from '.prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Post[]>) {
  const { category } = req.query;
  let posts: Post[] = [];

  if (category) {
    posts = await prisma.post.findMany({
      where: {
        categoryId: Number(category),
      },
    });
  } else {
    posts = await prisma.post.findMany();
  }

  res.json(posts);
}

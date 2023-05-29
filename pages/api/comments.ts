import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { postId, content, name } = req.body;

      const newComment = await prisma.comment.create({
        data: {
          postId: parseInt(postId),
          name,
          content
        },
      });

      res.status(201).json(newComment);
    } catch (error) {
      console.error('Failed to add comment', error);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const commentId = parseInt(req.query.commentId as string);

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, likes: true },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { likes: comment.likes + 1 },
      select: { id: true, likes: true },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error('Failed to like comment', error);
    res.status(500).json({ message: 'Failed to like comment' });
  }
}
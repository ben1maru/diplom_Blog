import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { postId } = req.query;

  // Замініть цей код своєю логікою для отримання даних допису на основі postId
  const post = {
    id: postId,
  };

  if (!post) {
    return res.status(404).json({ error: 'Допис не знайдено' });
  }

  return res.status(200).json(post);
}

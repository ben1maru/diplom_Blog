import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { postId } = req.query;

  const post = {
    id: postId,
  };

  if (!post) {
    return res.status(404).json({ error: 'Допис не знайдено' });
  }

  return res.status(200).json(post);
}

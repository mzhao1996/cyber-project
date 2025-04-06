import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body;
  const results = await search(query);
  res.status(200).json(results);
}

async function search(query: string) {
    
  return query;
}
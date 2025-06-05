// pages/api/assignments/[id]/solution.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id } = req.query;

    const chunks: Uint8Array[] = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const submission_date = new Date().toISOString();

      const data = {
        assignment_id: id,
        submission_date,
        solution_data: buffer.toString('base64'), // Przechowywanie jako base64
      };

      const filePath = path.join(process.cwd(), 'data', 'solutions.json');

      let existingData = [];
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        existingData = JSON.parse(fileContents);
      }

      existingData.push(data);
      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

      res.status(200).json({ message: 'Dane zostały zapisane pomyślnie.' });
    });
  } else {
    res.status(405).json({ message: 'Metoda niedozwolona.' });
  }
}

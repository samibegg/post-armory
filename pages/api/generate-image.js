import { generateImageWithImagen } from '@/lib/imagen';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const base64Image = await generateImageWithImagen(prompt);
    return res.status(200).json({ image: base64Image });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

// --- /pages/api/auth/register.js (NEW) ---
import clientPromiseAuth from "@/lib/mongodb" // Using path alias
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({ message: 'Invalid input.' });
    }

    const client = await clientPromiseAuth;
    const db = client.db("postarmory");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(422).json({ message: 'User already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      emailVerified: null, // NextAuth adapter uses this field
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({ message: 'Created user!' });
  } catch (error) {
    res.status(500).json({ message: 'Could not create user.' });
  }
}


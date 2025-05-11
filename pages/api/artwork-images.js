import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { client, db } = await connectToDatabase();
    
    // Query parameters
    const { productId, title, artist } = req.query;
    
    // Create query object based on provided parameters
    const query = {};
    
    if (productId) {
      query.productId = productId;
    }
    
    if (title) {
      // Use case-insensitive regex for title matching
      query.title = { $regex: new RegExp(title, 'i') };
    }
    
    if (artist) {
      // Use case-insensitive regex for artist matching
      query.artist = { $regex: new RegExp(artist, 'i') };
    }
    
    // Get artworks from the MongoDB collection
    const collection = db.collection('artwork_images');
    const artworks = await collection.find(query).toArray();
    
    return res.status(200).json(artworks);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Error connecting to database', error: error.message });
  }
}
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Get collection
    const collection = db.collection('artwork_images');
    
    // Extract data from request body
    const { 
      productId, 
      title, 
      artist, 
      transactionHash, 
      image, 
      fileName,
      uploadedAt 
    } = req.body;
    
    // Validate required fields
    if (!productId || !title || !image) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields' 
      });
    }
    
    // Create the document to insert
    const imageDocument = {
      productId,
      title,
      artist,
      transactionHash,
      image,           // This will be the base64 encoded image
      fileName,
      uploadedAt: uploadedAt || new Date().toISOString(),
      createdAt: new Date()
    };
    
    // Insert into MongoDB
    const result = await collection.insertOne(imageDocument);
    
    // Return success response with the ID
    return res.status(200).json({ 
      success: true, 
      message: 'Image uploaded successfully',
      imageId: result.insertedId.toString()
    });
    
  } catch (error) {
    console.error('Error uploading image to MongoDB:', error);
    
    return res.status(500).json({ 
      success: false,
      message: 'Error uploading image to database',
      error: error.message
    });
  }
}
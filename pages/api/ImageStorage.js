// Update pages/api/scan-product.js to import from the correct location

import { connectToDatabase } from '../../lib/mongodb';  // Updated import path

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log("Received scan request:", req.body);
  
  // Extract product details from request body
  const { productName, expirationTimestamp, owner, registrationTimestamp, mongodbUri } = req.body;
  
  // Basic validation
  if (!productName || !expirationTimestamp || !owner) {
    return res.status(400).json({ error: 'Missing required product information' });
  }
  
  // Use the environment variable or fall back to the URI from the request body
  const connectionUri = process.env.MONGODB_URI || mongodbUri;
  
  if (!connectionUri) {
    return res.status(500).json({ error: 'MongoDB URI not provided' });
  }
  
  try {
    // Connect to database using the URI
    const { db } = await connectToDatabase(connectionUri);
    
    // Create a collection for product scans if it doesn't exist
    const collection = db.collection('product_scans');
    
    const currentTimestamp = Math.floor(Date.now() / 1000);
    
    // Check if this product has been scanned before
    const existingProduct = await collection.findOne({ productName });
    
    let isFirstScan = false;
    let firstScanTimestamp = currentTimestamp;
    let totalScans = 1;
    
    if (!existingProduct) {
      // First scan of this product
      isFirstScan = true;
      
      // Create a new product scan record
      await collection.insertOne({
        productName,
        expirationTimestamp: Number(expirationTimestamp),
        owner,
        registrationTimestamp: Number(registrationTimestamp),
        firstScanTimestamp: currentTimestamp,
        lastScanTimestamp: currentTimestamp,
        totalScans: 1
      });
    } else {
      // Update existing product scan record
      isFirstScan = false;
      firstScanTimestamp = existingProduct.firstScanTimestamp;
      totalScans = existingProduct.totalScans + 1;
      
      await collection.updateOne(
        { productName },
        { 
          $set: { lastScanTimestamp: currentTimestamp },
          $inc: { totalScans: 1 }
        }
      );
    }
    
    // Return scan information
    return res.status(200).json({
      isFirstScan,
      firstScanTimestamp,
      totalScans,
      expirationTimestamp: Number(expirationTimestamp)
    });
    
  } catch (error) {
    console.error("Error recording scan:", error);
    return res.status(500).json({ error: error.message });
  }
}
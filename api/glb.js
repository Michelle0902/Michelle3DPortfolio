import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Set proper headers for GLB file
    res.setHeader('Content-Type', 'model/gltf-binary');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Read the GLB file from public directory
    const filePath = path.join(process.cwd(), 'public', 'portfolio-room.min.glb');
    const fileBuffer = fs.readFileSync(filePath);

    // Send the file
    res.status(200).send(fileBuffer);
  } catch (error) {
    console.error('Error serving GLB file:', error);
    res.status(500).json({ error: 'Failed to serve GLB file' });
  }
}

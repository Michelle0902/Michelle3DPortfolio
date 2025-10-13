import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

async function uploadGLB() {
  try {
    console.log('🚀 Uploading GLB file to Vercel Blob...');

    // Read the GLB file
    const glbPath = path.join(process.cwd(), 'public', 'portfolio-room.min.glb');
    const fileBuffer = fs.readFileSync(glbPath);

    console.log(`📁 File size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Upload to Vercel Blob
    const blob = await put('portfolio-room.min.glb', fileBuffer, {
      access: 'public',
      contentType: 'model/gltf-binary',
    });

    console.log('✅ GLB file uploaded successfully!');
    console.log('🔗 Blob URL:', blob.url);

    // Save the URL to a file for the app to use
    const urlData = {
      blobUrl: blob.url,
      uploadedAt: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'src', 'blob-config.json'),
      JSON.stringify(urlData, null, 2)
    );

    console.log('💾 Blob URL saved to src/blob-config.json');

  } catch (error) {
    console.error('❌ Error uploading GLB file:', error);
    process.exit(1);
  }
}

uploadGLB();

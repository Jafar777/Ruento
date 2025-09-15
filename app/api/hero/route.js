import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const heroData = await db.collection('heroVideos').findOne({});
    return NextResponse.json(heroData || {});
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    const subtitle = formData.get('subtitle');
    const ctaText = formData.get('ctaText');
    
    const { db } = await connectToDatabase();
    let heroData = {};
    let uploadResult = null;

    // If there's a file, upload to Cloudinary using stream approach
    if (file && file.size > 0) {
      // Convert file to buffer for streaming upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Use promise-based upload with stream
      uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            chunk_size: 6000000,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        // Write buffer to upload stream
        uploadStream.end(buffer);
      });

      if (uploadResult) {
        heroData.videoUrl = uploadResult.secure_url;
        heroData.publicId = uploadResult.public_id;
      }
    }

    // Add text content
    if (title) heroData.title = title;
    if (subtitle) heroData.subtitle = subtitle;
    if (ctaText) heroData.ctaText = ctaText;
    heroData.updatedAt = new Date();

    // Check if a hero video already exists
    const existingHero = await db.collection('heroVideos').findOne({});
    
    if (existingHero) {
      // If updating with a new video, delete the old one
      if (uploadResult && existingHero.publicId) {
        try {
          await cloudinary.uploader.destroy(existingHero.publicId, {
            resource_type: 'video',
          });
        } catch (deleteError) {
          console.warn('Could not delete old video from Cloudinary:', deleteError);
        }
      }
      
      // Update existing record
      await db.collection('heroVideos').updateOne(
        { _id: existingHero._id },
        { $set: heroData }
      );
    } else {
      // Create new record
      heroData.createdAt = new Date();
      await db.collection('heroVideos').insertOne(heroData);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Hero content updated successfully'
    });
  } catch (error) {
    console.error('Error saving hero content:', error);
    return NextResponse.json(
      { error: 'Failed to save hero content: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { db } = await connectToDatabase();
    const existingHero = await db.collection('heroVideos').findOne({});
    
    if (existingHero) {
      if (existingHero.publicId) {
        try {
          await cloudinary.uploader.destroy(existingHero.publicId, {
            resource_type: 'video',
          });
        } catch (deleteError) {
          console.warn('Could not delete video from Cloudinary:', deleteError);
        }
      }
      await db.collection('heroVideos').deleteOne({ _id: existingHero._id });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hero content:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero content' },
      { status: 500 }
    );
  }
}
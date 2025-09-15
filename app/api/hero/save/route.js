import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function POST(request) {
  try {
    const { videoUrl, publicId } = await request.json();
    const { db } = await connectToDatabase();

    // Check if a hero video already exists
    const existingVideo = await db.collection('heroVideos').findOne({});
    
    if (existingVideo) {
      // Update existing record
      await db.collection('heroVideos').updateOne(
        { _id: existingVideo._id },
        { 
          $set: { 
            videoUrl: videoUrl,
            publicId: publicId,
            updatedAt: new Date() 
          } 
        }
      );
    } else {
      // Create new record
      await db.collection('heroVideos').insertOne({
        videoUrl: videoUrl,
        publicId: publicId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Video saved successfully'
    });
  } catch (error) {
    console.error('Error saving hero video:', error);
    return NextResponse.json(
      { error: 'Failed to save hero video: ' + error.message },
      { status: 500 }
    );
  }
}
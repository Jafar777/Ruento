// app/api/trip-date/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const tripDate = await db.collection('trip_dates').findOne({});
    
    return NextResponse.json(tripDate || {});
  } catch (error) {
    console.error('Error fetching trip date:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { date, places, images, description } = await request.json();
    
    // Validate input
    if (!date || !places || !description) {
      return NextResponse.json(
        { message: 'Date, places, and description are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Update or create the trip date document
    const result = await db.collection('trip_dates').updateOne(
      {}, // Empty filter to match any document
      { 
        $set: { 
          date, 
          places: Array.isArray(places) ? places : [places],
          images: Array.isArray(images) ? images : (images ? [images] : []),
          description,
          updatedAt: new Date()
        } 
      },
      { upsert: true } // Create if doesn't exist
    );

    return NextResponse.json({
      message: 'Trip date updated successfully',
      success: true
    });
  } catch (error) {
    console.error('Error updating trip date:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
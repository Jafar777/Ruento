// app/api/services/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const services = await db.collection('services').find({}).toArray();
    
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { type, title, description, image } = await request.json();
    
    // Validate input
    if (!type || !title || !description) {
      return NextResponse.json(
        { message: 'Type, title, and description are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Update or create the service document
    const result = await db.collection('services').updateOne(
      { type },
      { 
        $set: { 
          title,
          description,
          image: image || '',
          updatedAt: new Date()
        } 
      },
      { upsert: true } // Create if doesn't exist
    );

    return NextResponse.json({
      message: 'Service updated successfully',
      success: true
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
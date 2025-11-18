// app/api/services/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const services = await db.collection('services').find({}).toArray();
    
    // Convert MongoDB ObjectId to string for client-side use
    const serializedServices = services.map(service => ({
      ...service,
      _id: service._id.toString(),
      images: service.images || []
    }));
    
    return NextResponse.json(serializedServices);
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
    const { type, title, description, icon, images } = await request.json();
    
    if (!type || !title || !description || !icon) {
      return NextResponse.json(
        { message: 'Type, title, description, and icon are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Check if service type already exists
    const existingService = await db.collection('services').findOne({ type });
    if (existingService) {
      return NextResponse.json(
        { message: 'Service type already exists' },
        { status: 400 }
      );
    }

    const result = await db.collection('services').insertOne({
      type: type.toLowerCase().trim(),
      title: title.trim(),
      description: description.trim(),
      icon: icon,
      images: images || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      message: 'Service created successfully',
      success: true,
      serviceId: result.insertedId
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
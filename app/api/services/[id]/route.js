// app/api/services/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { type, title, description, icon, images } = await request.json();
    
    if (!type || !title || !description || !icon) {
      return NextResponse.json(
        { message: 'Type, title, description, and icon are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Check if service type already exists for other services
    const existingService = await db.collection('services').findOne({ 
      type: type.toLowerCase().trim(), 
      _id: { $ne: new ObjectId(id) } 
    });
    
    if (existingService) {
      return NextResponse.json(
        { message: 'Service type already exists' },
        { status: 400 }
      );
    }

    const result = await db.collection('services').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          type: type.toLowerCase().trim(),
          title: title.trim(),
          description: description.trim(),
          icon,
          images: images || [],
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

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

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const { db } = await connectToDatabase();
    
    const result = await db.collection('services').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Service deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
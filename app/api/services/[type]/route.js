// app/api/services/[type]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// NOTE: In Next.js 14, params is a Promise that needs to be awaited
export async function GET(request, { params }) {
  try {
    // Await the params promise and use "type" instead of "id"
    const { type } = await params;
    const { db } = await connectToDatabase();
    
    // Check if type is a valid ObjectId (for backward compatibility)
    let service;
    if (ObjectId.isValid(type)) {
      service = await db.collection('services').findOne({ _id: new ObjectId(type) });
    }
    
    // If not found by ObjectId, try to find by type
    if (!service) {
      // Try exact type match
      service = await db.collection('services').findOne({ type: type });
    }
    
    // If still not found, try case-insensitive match
    if (!service) {
      service = await db.collection('services').findOne({
        type: { $regex: new RegExp(`^${type}$`, 'i') }
      });
    }
    
    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Convert ObjectId to string
    service._id = service._id.toString();
    
    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Await the params promise
    const { type } = await params;
    const body = await request.json();
    const { 
      type: newType, 
      title, 
      description, 
      icon, 
      images,
      duration,
      groupSize,
      availability,
      locations,
      price,
      priceUnit,
      includedFeatures,
      itinerary,
      contactInfo,
      benefits
    } = body;
    
    if (!newType || !title || !description || !icon) {
      return NextResponse.json(
        { message: 'Type, title, description, and icon are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // First find the service by type
    let service;
    if (ObjectId.isValid(type)) {
      service = await db.collection('services').findOne({ _id: new ObjectId(type) });
    }
    
    if (!service) {
      service = await db.collection('services').findOne({ type: type });
    }
    
    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }
    
    // Check if service type already exists for other services
    const existingService = await db.collection('services').findOne({ 
      type: newType.toLowerCase().trim(), 
      _id: { $ne: service._id } 
    });
    
    if (existingService) {
      return NextResponse.json(
        { message: 'Service type already exists' },
        { status: 400 }
      );
    }

    const result = await db.collection('services').updateOne(
      { _id: service._id },
      { 
        $set: { 
          type: newType.toLowerCase().trim(),
          title: title.trim(),
          description: description.trim(),
          icon,
          images: images || [],
          duration: duration || '3-7 Days',
          groupSize: groupSize || '2-12 People',
          availability: availability || 'Year-round',
          locations: locations || 'Multiple',
          price: price || 499,
          priceUnit: priceUnit || 'person',
          includedFeatures: includedFeatures || [
            'Expert local guides',
            'Comfortable accommodations',
            'All transportation included',
            'Entry fees to attractions',
            'Traditional meals',
            '24/7 support'
          ],
          itinerary: itinerary || [
            { day: 'Day 1', title: 'Arrival & Welcome', description: 'Airport pickup and traditional welcome dinner' },
            { day: 'Day 2', title: 'City Exploration', description: 'Guided tour of historical sites and local markets' },
            { day: 'Day 3', title: 'Cultural Immersion', description: 'Traditional workshops and cultural performances' }
          ],
          contactInfo: contactInfo || {
            phone: '+1 (234) 567-890',
            email: 'info@ruento.com',
            liveChat: 'Available 24/7'
          },
          benefits: benefits || [
            'Best price guarantee',
            'Flexible cancellation',
            'Local expert guides',
            'Sustainable tourism'
          ],
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
    // Await the params promise
    const { type } = await params;
    const { db } = await connectToDatabase();
    
    let service;
    if (ObjectId.isValid(type)) {
      service = await db.collection('services').findOne({ _id: new ObjectId(type) });
    }
    
    if (!service) {
      service = await db.collection('services').findOne({ type: type });
    }
    
    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }
    
    const result = await db.collection('services').deleteOne({
      _id: service._id
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
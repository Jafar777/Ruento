// app/api/services/[id]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { db } = await connectToDatabase();
    
    // Check if id is a valid ObjectId
    let service;
    if (ObjectId.isValid(id)) {
      service = await db.collection('services').findOne({ _id: new ObjectId(id) });
    } else {
      // If not ObjectId, try to find by type
      service = await db.collection('services').findOne({ type: id });
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
    const { id } = params;
    const body = await request.json();
    const { 
      type, 
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
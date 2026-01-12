// app/api/services/[type]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper function to clean and process service data
const processServiceData = (data) => {
  const processed = { ...data };
  
  // Process locations - convert string to array if needed
  if (typeof processed.locations === 'string') {
    const locationsStr = processed.locations.trim();
    if (locationsStr === '') {
      processed.locations = [];
    } else {
      processed.locations = locationsStr.split(',').map(l => l.trim()).filter(l => l);
    }
  }
  
  // Convert price to number, handle empty string
  if (processed.price !== undefined && processed.price !== null) {
    if (processed.price === '' || processed.price === 0) {
      processed.price = null;
    } else {
      processed.price = Number(processed.price);
      if (isNaN(processed.price)) {
        processed.price = null;
      }
    }
  }
  
  // Trim string fields
  const stringFields = ['duration', 'groupSize', 'availability', 'priceUnit', 'title', 'description'];
  stringFields.forEach(field => {
    if (processed[field] && typeof processed[field] === 'string') {
      processed[field] = processed[field].trim();
    }
  });
  
  return processed;
};

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
    
    // Ensure arrays are present
    if (!service.images) service.images = [];
    if (!service.features) service.features = [];
    if (!service.benefits) service.benefits = [];
    if (!service.locations) service.locations = [];
    
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
    
    // Process the data
    const processedData = processServiceData(body);
    
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
      rating,
      features,
      itinerary,
      contactInfo,
      benefits
    } = processedData;
    
    if (!title || !description || !icon) {
      return NextResponse.json(
        { message: 'Title, description, and icon are required' },
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
    if (newType && newType !== type) {
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
    }

    // Build update object
    const updateObj = {
      title: title.trim(),
      description: description.trim(),
      icon,
      images: images || [],
      duration: duration || '',
      groupSize: groupSize || '',
      availability: availability || '',
      locations: locations || [],
      price: price !== undefined ? price : null,
      priceUnit: priceUnit || '',
      rating: rating || 4.5,
      features: features || [],
      itinerary: itinerary || [],
      contactInfo: contactInfo || {},
      benefits: benefits || [],
      updatedAt: new Date()
    };

    // If newType is provided and different, update it
    if (newType && newType !== type) {
      updateObj.type = newType.toLowerCase().trim();
    }

    const result = await db.collection('services').updateOne(
      { _id: service._id },
      { $set: updateObj }
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
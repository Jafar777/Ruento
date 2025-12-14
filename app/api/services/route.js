// app/api/services/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const services = await db.collection('services').find({}).toArray();
    
    const serializedServices = services.map(service => ({
      ...service,
      _id: service._id.toString(),
      images: service.images || [],
      // Ensure all new fields exist with defaults if not present
      duration: service.duration || '3-7 Days',
      groupSize: service.groupSize || '2-12 People',
      availability: service.availability || 'Year-round',
      locations: service.locations || 'Multiple',
      price: service.price || 499,
      priceUnit: service.priceUnit || 'person',
      includedFeatures: service.includedFeatures || [
        'Expert local guides',
        'Comfortable accommodations',
        'All transportation included',
        'Entry fees to attractions',
        'Traditional meals',
        '24/7 support'
      ],
      itinerary: service.itinerary || [
        { day: 'Day 1', title: 'Arrival & Welcome', description: 'Airport pickup and traditional welcome dinner' },
        { day: 'Day 2', title: 'City Exploration', description: 'Guided tour of historical sites and local markets' },
        { day: 'Day 3', title: 'Cultural Immersion', description: 'Traditional workshops and cultural performances' }
      ],
      contactInfo: service.contactInfo || {
        phone: '+1 (234) 567-890',
        email: 'info@ruento.com',
        liveChat: 'Available 24/7'
      },
      benefits: service.benefits || [
        'Best price guarantee',
        'Flexible cancellation',
        'Local expert guides',
        'Sustainable tourism'
      ]
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
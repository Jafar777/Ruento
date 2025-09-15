// app/api/get-to-know-russia/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const { db } = await connectToDatabase();
    
    if (category) {
      // Get specific category
      const categoryData = await db.collection('russia_categories').findOne({ type: category });
      return NextResponse.json(categoryData || { type: category, items: [] });
    } else {
      // Get all categories
      const categories = await db.collection('russia_categories').find({}).toArray();
      return NextResponse.json(categories);
    }
  } catch (error) {
    console.error('Error fetching Russia categories:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { type, items } = await request.json();
    
    // Validate input
    if (!type || !Array.isArray(items)) {
      return NextResponse.json(
        { message: 'Type and items array are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Update or create the category document
    const result = await db.collection('russia_categories').updateOne(
      { type },
      { 
        $set: { 
          items,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Category updated successfully',
      success: true
    });
  } catch (error) {
    console.error('Error updating Russia category:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
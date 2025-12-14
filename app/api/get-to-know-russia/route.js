// app/api/get-to-know-russia/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');
    
    const { db } = await connectToDatabase();
    
    if (category && id) {
      // Get specific item
      const categoryData = await db.collection('russia_categories').findOne({ type: category });
      if (categoryData && categoryData.items) {
        console.log(`Looking for item with id: ${id} in category: ${category}`);
        console.log(`Total items: ${categoryData.items.length}`);
        
        // Try to find item by id
        const item = categoryData.items.find(item => {
          console.log(`Comparing: ${item.id} with ${id}`);
          return item.id === id;
        });
        
        if (item) {
          console.log(`Item found: ${item.title}`);
          return NextResponse.json(item);
        } else {
          // If item not found by id, try to find by slug (backward compatibility)
          const slug = searchParams.get('slug');
          if (slug && slug !== '-') {
            const itemBySlug = categoryData.items.find(item => item.slug === slug);
            if (itemBySlug) {
              console.log(`Item found by slug: ${itemBySlug.title}`);
              return NextResponse.json(itemBySlug);
            }
          }
          
          // Try to find by index in URL
          const match = id.match(/restaurants-(\d+)/);
          if (match) {
            const index = parseInt(match[1]);
            if (!isNaN(index) && categoryData.items[index]) {
              console.log(`Item found by index: ${categoryData.items[index].title}`);
              return NextResponse.json(categoryData.items[index]);
            }
          }
          
          console.log('Item not found by any method');
          return NextResponse.json(null);
        }
      }
      return NextResponse.json(null);
    } else if (category) {
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
    
    if (!type || !Array.isArray(items)) {
      return NextResponse.json(
        { message: 'Type and items array are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Generate IDs and slugs for items that don't have them
    const itemsWithIds = items.map((item, index) => {
      // Create ID if doesn't exist
      if (!item.id) {
        item.id = `${type}-${index}-${Date.now()}`;
      }
      
      // Create slug from title
      if (!item.slug && item.title) {
        item.slug = item.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      } else if (!item.slug) {
        item.slug = `${type}-${index}`;
      }
      
      return {
        ...item,
        updatedAt: new Date()
      };
    });

    const result = await db.collection('russia_categories').updateOne(
      { type },
      { 
        $set: { 
          items: itemsWithIds,
          updatedAt: new Date(),
          title: type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({
      message: 'Category updated successfully',
      success: true,
      items: itemsWithIds
    });
  } catch (error) {
    console.error('Error updating Russia category:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
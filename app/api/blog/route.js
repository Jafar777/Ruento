// app/api/blog/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const { db } = await connectToDatabase();
    
    if (id) {
      // Get specific blog post
      const blog = await db.collection('blogs').findOne({ _id: new ObjectId(id) });
      return NextResponse.json(blog || {});
    } else {
      // Get all blog posts, sorted by date
      const blogs = await db.collection('blogs').find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json(blogs);
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, content, images, author, excerpt } = await request.json();
    
    // Validate input
    if (!title || !content || !author) {
      return NextResponse.json(
        { message: 'Title, content, and author are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Create new blog post
    const result = await db.collection('blogs').insertOne({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      images: images || [],
      author,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      message: 'Blog post created successfully',
      id: result.insertedId,
      success: true
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, title, content, images, author, excerpt } = await request.json();
    
    // Validate input
    if (!id || !title || !content || !author) {
      return NextResponse.json(
        { message: 'ID, title, content, and author are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Update blog post
    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          title,
          content,
          excerpt: excerpt || content.substring(0, 150) + '...',
          images: images || [],
          author,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Blog post updated successfully',
      success: true
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Delete blog post
    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Blog post deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
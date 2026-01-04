// app/api/contacts/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const contacts = await db.collection('contacts').findOne({});
    
    if (!contacts) {
      // Return default contacts if none exist
      return NextResponse.json({
        phone: '+7 (999) 999-9999',
        whatsapp: '+7 (999) 999-9999',
        email: 'info@ruento.com',
        address: '123 Moscow Street, Moscow, Russia',
        instagram: 'https://instagram.com/ruento',
        facebook: 'https://facebook.com/ruento',
        twitter: 'https://twitter.com/ruento',
        linkedin: 'https://linkedin.com/company/ruento',
        youtube: 'https://youtube.com/ruento',
        tiktok: 'https://tiktok.com/@ruento',
        telegram: 'https://t.me/ruento',
        snapchat: 'https://snapchat.com/add/ruento',
        businessHours: 'الإثنين - الجمعة: 9 صباحًا - 6 مساءً',
        whatsappMessage: 'مرحباً! أنا مهتم بخدماتكم.',
        seoDescription: 'روينتو للسياحة - خدمات سفر مميزة في روسيا',
        seoKeywords: 'سياحة روسيا، سفر إلى روسيا، جولات موسكو، سفر سانت بطرسبرغ',
        privacyPolicy: 'https://ruento.com/privacy',
        termsOfService: 'https://ruento.com/terms'
      });
    }
    
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الاتصال' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { db } = await connectToDatabase();
    
    const data = await request.json();
    
    // Format WhatsApp number to ensure it's a valid phone number
    if (data.whatsapp) {
      // Remove all non-digit characters except plus
      let whatsappNumber = data.whatsapp.replace(/[^\d+]/g, '');
      // Ensure it starts with country code if it doesn't have +
      if (!whatsappNumber.startsWith('+')) {
        // Add +7 for Russia if no country code specified
        whatsappNumber = `+7${whatsappNumber}`;
      }
      data.whatsapp = whatsappNumber;
    }
    
    // Remove _id from data if present (to prevent updating immutable field)
    delete data._id;
    
    // Check if contacts document exists
    const existingContacts = await db.collection('contacts').findOne({});
    
    if (existingContacts) {
      // Update existing document using its _id
      const result = await db.collection('contacts').updateOne(
        { _id: existingContacts._id },
        { $set: { ...data, updatedAt: new Date() } }
      );
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'تم تحديث بيانات الاتصال بنجاح',
          updated: result.modifiedCount > 0
        },
        { status: 200 }
      );
    } else {
      // Insert new document if none exists
      const result = await db.collection('contacts').insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'تم إنشاء بيانات الاتصال بنجاح',
          insertedId: result.insertedId
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error updating contacts:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث بيانات الاتصال' },
      { status: 500 }
    );
  }
}
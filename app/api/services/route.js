import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Service from '@/models/Service';

// Global connection cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// ONLY THESE 4 SERVICES - Both English and Arabic
const validTypes = [
  // English
  'residence',
  'hotels',
  'transportation',
  'events',
  // Arabic
  'إقامة',
  'فنادق',
  'نقل',
  'فعاليات'
];

// GET all services
export async function GET() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();

    // Check if Service model is properly defined
    if (!Service) {
      throw new Error('Service model not found');
    }

    console.log('Fetching services from database...');
    const services = await Service.find({}).lean();

    console.log(`Found ${services.length} services`);

    // Convert MongoDB documents to plain objects
    const serializedServices = services.map(service => ({
      ...service,
      _id: service._id?.toString() || service._id,
      createdAt: service.createdAt?.toISOString(),
      updatedAt: service.updatedAt?.toISOString()
    }));

    return NextResponse.json(serializedServices, { status: 200 });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      {
        error: 'فشل في جلب البيانات',
        message: error.message,
        services: [] // Return empty array on error
      },
      { status: 500 }
    );
  }
}

// POST create new service
export async function POST(request) {
  try {
    console.log('Connecting to MongoDB for POST...');
    await connectToDatabase();

    const data = await request.json();
    console.log('Received service data:', data);

    // Validate required fields
    if (!data.type || !data.title || !data.description) {
      return NextResponse.json(
        {
          error: 'بيانات ناقصة',
          message: 'النوع والعنوان والوصف مطلوبة'
        },
        { status: 400 }
      );
    }

    // Validate type - only allow the 4 specific services
    const serviceType = data.type.trim();
    if (!validTypes.includes(serviceType)) {
      return NextResponse.json(
        {
          error: 'نوع غير صالح',
          message: `النوع "${serviceType}" غير مسموح. الأنواع المسموح بها فقط: إقامة، فنادق، نقل، فعاليات (أو باللغة الإنجليزية: residence, hotels, transportation, events)`,
          validTypes: validTypes
        },
        { status: 400 }
      );
    }

    // Check if service with same type already exists
    const existingService = await Service.findOne({ type: serviceType });
    if (existingService) {
      return NextResponse.json(
        {
          error: 'الخدمة موجودة بالفعل',
          message: `الخدمة بنوع "${serviceType}" موجودة بالفعل. يمكنك تعديلها بدلاً من إنشاء خدمة جديدة.`
        },
        { status: 400 }
      );
    }

    // Set icon based on type
    const getIconByType = (type) => {
      const iconMap = {
        'residence': '🏠',
        'إقامة': '🏠',
        'hotels': '🏨',
        'فنادق': '🏨',
        'transportation': '🚗',
        'نقل': '🚗',
        'events': '🎪',
        'فعاليات': '🎪'
      };
      return iconMap[type] || '📋';
    };

    // Prepare service data
    const serviceData = {
      type: serviceType,
      title: data.title || 'عنوان الخدمة',
      description: data.description || 'وصف الخدمة باللغة العربية',
      icon: data.icon || getIconByType(serviceType),
      images: data.images || [],
      duration: data.duration || '3-7 أيام',
      groupSize: data.groupSize || '2-12 شخص',
      availability: data.availability || 'على مدار السنة',
      locations: Array.isArray(data.locations) ? data.locations : (data.locations || ['متعدد']),
      price: Number(data.price) || 499, // Convert to number
      priceUnit: data.priceUnit || 'للشخص',
      rating: Number(data.rating) || 4.5, // Convert to number
      features: data.features || [
        'مرشدين محليين خبراء',
        'إقامة مريحة',
        'جميع وسائل النقل مشمولة',
        'رسوم دخول المعالم السياحية',
        'وجبات تقليدية',
        'دعم على مدار الساعة'
      ],
      itinerary: data.itinerary || [
        { يوم: 'اليوم الأول', عنوان: 'الوصول والترحيب', وصف: 'استقبال من المطار وعشاء ترحيبي تقليدي' },
        { يوم: 'اليوم الثاني', عنوان: 'استكشاف المدينة', وصف: 'جولة إرشادية في المواقع التاريخية والأسواق المحلية' },
        { يوم: 'اليوم الثالث', عنوان: 'الانغماس الثقافي', وصف: 'ورش عمل تقليدية وعروض ثقافية' }
      ],
      contactInfo: data.contactInfo || {
        هاتف: '+7 (999) 999-9999',
        إيميل: 'info@ruento.com',
        دردشة: 'متاحة 24/7'
      },
      benefits: data.benefits || [
        'ضمان أفضل سعر',
        'إلغاء مرن',
        'مرشدين محليين خبراء',
        'سياحة مستدامة'
      ]
    };

    console.log('Creating new service with data:', serviceData);

    const service = new Service(serviceData);
    await service.save();

    console.log('Service created successfully:', service._id);

    return NextResponse.json(
      {
        success: true,
        message: 'تم إضافة الخدمة بنجاح',
        service: {
          ...service.toObject(),
          _id: service._id.toString()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating service:', error);

    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          error: 'خطأ في التحقق من البيانات',
          message: error.message,
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'فشل في إنشاء الخدمة',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// PUT method to update existing service
export async function PUT(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json(
        { error: 'نوع الخدمة مطلوب' },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Validate type if it's being updated
    if (data.type && !validTypes.includes(data.type)) {
      return NextResponse.json(
        {
          error: 'نوع غير صالح',
          message: `النوع "${data.type}" غير مسموح. الأنواع المسموح بها فقط: إقامة، فنادق، نقل، فعاليات`
        },
        { status: 400 }
      );
    }

    const updatedService = await Service.findOneAndUpdate(
      { type: type },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        { error: 'الخدمة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'تم تحديث الخدمة بنجاح',
        service: updatedService
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'فشل في تحديث الخدمة', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE method to remove service
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json(
        { error: 'نوع الخدمة مطلوب' },
        { status: 400 }
      );
    }

    const deletedService = await Service.findOneAndDelete({ type: type });

    if (!deletedService) {
      return NextResponse.json(
        { error: 'الخدمة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'تم حذف الخدمة بنجاح'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'فشل في حذف الخدمة', message: error.message },
      { status: 500 }
    );
  }
}
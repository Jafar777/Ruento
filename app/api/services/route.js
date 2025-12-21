// app/api/services/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';

// GET all services
export async function GET() {
  try {
    await connectDB();
    
    const services = await Service.find({});
    
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'فشل في جلب البيانات' },
      { status: 500 } 
    );
  }
}

// POST create new service
export async function POST(request) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Ensure data is in Arabic
    const arabicData = {
      type: data.type || 'خدمة',
      title: data.title || 'عنوان الخدمة',
      description: data.description || 'وصف الخدمة باللغة العربية',
      icon: data.icon || '📋',
      images: data.images || [],
      duration: data.duration || '3-7 أيام',
      groupSize: data.groupSize || '2-12 شخص',
      availability: data.availability || 'على مدار السنة',
      locations: data.locations || ['متعدد'],
      price: data.price || 499,
      priceUnit: data.priceUnit || 'للشخص',
      rating: data.rating || 4.5,
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
        هاتف: '+1 (234) 567-890',
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
    
    const service = new Service(arabicData);
    await service.save();
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'تم إضافة الخدمة بنجاح',
        service 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'فشل في إنشاء الخدمة' },
      { status: 500 }
    );
  }
}
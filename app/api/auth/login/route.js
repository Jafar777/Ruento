// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        console.log('Login attempt for:', email);

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();

        // Debug: list collections in development to verify connection
        if (process.env.NODE_ENV === 'development') {
            const collections = await db.listCollections().toArray();
            console.log('Collections in database:', collections.map(c => c.name));
        }

        // Query the admins collection inside the test database
        const admin = await db.collection('admins').findOne({ email });
        console.log('Admin found:', admin ? 'Yes' : 'No');

        // Check if admin exists
        if (!admin) {
            console.log('Admin not found for email:', email);
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid password for email:', email);
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: admin._id.toString(), email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return NextResponse.json({
            message: 'Login successful',
            token,
            admin: { id: admin._id, email: admin.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
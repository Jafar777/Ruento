// app/blog/page.jsx
import React from 'react';
import BlogClient from './BlogClient'; // Import the new Client Component

const BlogPage = async () => {
  // Fetch blogs from API (server-side)
  let blogs = [];
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/blog`, {
      cache: 'no-store'
    });
    blogs = await response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }

  // Pass data to Client Component
  return <BlogClient blogs={blogs} />;
};

export default BlogPage;
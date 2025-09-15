// app/admin/dashboard/blog/page.jsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import Navbar from '../../../components/Navbar';
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaSave, FaImage, FaUpload } from 'react-icons/fa';

const BlogManagement = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    images: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { translations } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchBlogs();
    }
  }, [router]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setMessage('Error loading blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBlog),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Blog post created successfully!');
        setNewBlog({
          title: '',
          content: '',
          excerpt: '',
          author: '',
          images: []
        });
        fetchBlogs(); // Refresh the list
      } else {
        setMessage(data.message || 'Error creating blog post');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      setMessage('Error creating blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/blog', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingBlog),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Blog post updated successfully!');
        setEditingBlog(null);
        fetchBlogs(); // Refresh the list
      } else {
        setMessage(data.message || 'Error updating blog post');
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      setMessage('Error updating blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Blog post deleted successfully!');
        fetchBlogs(); // Refresh the list
      } else {
        setMessage(data.message || 'Error deleting blog post');
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      setMessage('Error deleting blog post');
    }
  };

  const addImage = async (e, isNewBlog = true) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const data = await response.json();
      if (data.secure_url) {
        if (isNewBlog) {
          setNewBlog(prev => ({
            ...prev,
            images: [...prev.images, data.secure_url]
          }));
        } else {
          setEditingBlog(prev => ({
            ...prev,
            images: [...prev.images, data.secure_url]
          }));
        }
        setMessage('Image uploaded successfully!');
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    }
  };

  const removeImage = (index, isNewBlog = true) => {
    if (isNewBlog) {
      setNewBlog(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      setEditingBlog(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 text-purple-500 ">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="bg-gray-600 text-white p-3 rounded-full hover:bg-gray-700 transition duration-200 mr-4"
              >
                <FaArrowLeft />
              </button>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {translations.manageBlog || 'Manage Blog'}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
            >
              {translations.logout}
            </button>
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded-md ${message.includes('success') ? 'bg-green-800' : 'bg-red-800'}`}>
              {message}
            </div>
          )}

          {/* Create New Blog Form */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-8">
            <h2 className="text-2xl font-semibold mb-6">
              {editingBlog ? translations.editBlog || 'Edit Blog Post' : translations.createBlog || 'Create New Blog Post'}
            </h2>

            <form onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {translations.title || 'Title'}
                  </label>
                  <input
                    type="text"
                    value={editingBlog ? editingBlog.title : newBlog.title}
                    onChange={(e) => editingBlog 
                      ? setEditingBlog({...editingBlog, title: e.target.value})
                      : setNewBlog({...newBlog, title: e.target.value})
                    }
                    className="w-full p-3 bg-gray-700 rounded-md text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {translations.author || 'Author'}
                  </label>
                  <input
                    type="text"
                    value={editingBlog ? editingBlog.author : newBlog.author}
                    onChange={(e) => editingBlog 
                      ? setEditingBlog({...editingBlog, author: e.target.value})
                      : setNewBlog({...newBlog, author: e.target.value})
                    }
                    className="w-full p-3 bg-gray-700 rounded-md text-white"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  {translations.excerpt || 'Excerpt (short description)'}
                </label>
                <textarea
                  value={editingBlog ? editingBlog.excerpt : newBlog.excerpt}
                  onChange={(e) => editingBlog 
                    ? setEditingBlog({...editingBlog, excerpt: e.target.value})
                    : setNewBlog({...newBlog, excerpt: e.target.value})
                  }
                  className="w-full p-3 bg-gray-700 rounded-md text-white"
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  {translations.content || 'Content'}
                </label>
                <textarea
                  value={editingBlog ? editingBlog.content : newBlog.content}
                  onChange={(e) => editingBlog 
                    ? setEditingBlog({...editingBlog, content: e.target.value})
                    : setNewBlog({...newBlog, content: e.target.value})
                  }
                  className="w-full p-3 bg-gray-700 rounded-md text-white"
                  rows={8}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  {translations.images || 'Images'}
                </label>
                
                <label className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700 transition w-fit mb-4">
                  <FaUpload className="mr-2" />
                  {translations.uploadImage || 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => addImage(e, !editingBlog)}
                    className="hidden"
                  />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(editingBlog ? editingBlog.images : newBlog.images).map((image, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 relative">
                      <button
                        onClick={() => removeImage(index, !editingBlog)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                      >
                        <FaTrash size={14} />
                      </button>
                      
                      <img 
                        src={image} 
                        alt="Preview" 
                        className="w-full h-40 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-md font-semibold flex items-center hover:from-blue-600 hover:to-purple-700 transition duration-300 disabled:opacity-50"
                >
                  <FaSave className="mr-2" />
                  {saving ? translations.saving || 'Saving...' : editingBlog ? translations.update || 'Update' : translations.create || 'Create'}
                </button>

                {editingBlog && (
                  <button
                    type="button"
                    onClick={() => setEditingBlog(null)}
                    className="bg-gray-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-700 transition duration-300"
                  >
                    {translations.cancel || 'Cancel'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Existing Blogs */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <h2 className="text-2xl font-semibold mb-6">
              {translations.existingBlogs || 'Existing Blog Posts'}
            </h2>

            {blogs.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                {translations.noBlogs || 'No blog posts yet. Create your first one!'}
              </p>
            ) : (
              <div className="space-y-6">
                {blogs.map((blog) => (
                  <div key={blog._id} className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">{blog.title}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingBlog({...blog, id: blog._id})}
                          className="text-blue-500 hover:text-blue-600 transition"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="text-red-500 hover:text-red-600 transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4">{blog.excerpt}</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>{translations.by || 'By'} {blog.author}</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>

                    {blog.images.length > 0 && (
                      <div className="mt-4">
                        <img 
                          src={blog.images[0]} 
                          alt={blog.title}
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
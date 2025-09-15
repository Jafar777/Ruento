'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const HeroVideoEditor = () => {
  const [heroData, setHeroData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/hero');
      if (!response.ok) throw new Error('Failed to fetch hero data');
      const data = await response.json();
      setHeroData(data);
    } catch (error) {
      console.error('Error fetching hero data:', error);
    }
  };

// Replace the handleDirectUpload function with this:
const handleDirectUpload = async (file, textData) => {
  const formData = new FormData();
  if (file) formData.append('file', file);
  if (textData.title) formData.append('title', textData.title);
  if (textData.subtitle) formData.append('subtitle', textData.subtitle);
  if (textData.ctaText) formData.append('ctaText', textData.ctaText);

  try {
    const response = await fetch('/api/hero', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Upload failed: ' + error.message);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const subtitle = formData.get('subtitle');
    const ctaText = formData.get('ctaText');
    const file = formData.get('video');

    if (!file && !title && !subtitle && !ctaText) {
      setError('Please provide either a video or text content');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess('');

    try {
      await handleDirectUpload(file, { title, subtitle, ctaText });
      setSuccess('Hero content updated successfully!');
      fetchHeroData();
    } catch (error) {
      setError('Update failed: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteVideo = async () => {
    if (!confirm('Are you sure you want to delete the current video?')) return;

    try {
      const response = await fetch('/api/hero', {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Video deleted successfully');
        setHeroData({ ...heroData, videoUrl: null, publicId: null });
      } else {
        setError('Failed to delete video');
      }
    } catch (error) {
      setError('Delete failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 mt-12">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Hero Content Manager
          </h1>

          <div className="w-20"></div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-6 py-4 rounded-xl mb-8 backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-200 px-6 py-4 rounded-xl mb-8 backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Video Section */}
          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30">
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">Current Hero Content</h2>
            
            {heroData.videoUrl ? (
              <div className="space-y-6">
                <div className="relative rounded-xl overflow-hidden border-2 border-blue-500/30">
                  <video
                    src={heroData.videoUrl}
                    controls
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-sm text-blue-300">Click to play</span>
                  </div>
                </div>
                
                <button
                  onClick={handleDeleteVideo}
                  disabled={uploading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Current Video
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p>No video uploaded yet</p>
              </div>
            )}

            {/* Current Text Content */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Current Text Content</h3>
              {heroData.title || heroData.subtitle || heroData.ctaText ? (
                <div className="space-y-4 text-gray-300">
                  {heroData.title && <p><strong>Title:</strong> {heroData.title}</p>}
                  {heroData.subtitle && <p><strong>Subtitle:</strong> {heroData.subtitle}</p>}
                  {heroData.ctaText && <p><strong>Button Text:</strong> {heroData.ctaText}</p>}
                </div>
              ) : (
                <p className="text-gray-400">No text content set yet</p>
              )}
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30">
            <h2 className="text-2xl font-semibold mb-6 text-purple-400">Update Hero Content</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Text Inputs */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={heroData.title || ''}
                    placeholder="Discover the Beauty of Russia"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="subtitle" className="block text-sm font-medium text-gray-300 mb-2">
                    Subtitle
                  </label>
                  <textarea
                    id="subtitle"
                    name="subtitle"
                    defaultValue={heroData.subtitle || ''}
                    placeholder="Experience the rich culture, stunning landscapes, and historic cities of Russia"
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="ctaText" className="block text-sm font-medium text-gray-300 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    id="ctaText"
                    name="ctaText"
                    defaultValue={heroData.ctaText || ''}
                    placeholder="Explore Tours"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* File Input */}
              <div>
                <label htmlFor="video" className="block text-sm font-medium text-gray-300 mb-2">
                  Hero Video (Optional)
                </label>
                <div className="border-2 border-dashed border-blue-400/30 rounded-2xl p-6 text-center hover:border-blue-400/50 transition-all duration-300">
                  <input
                    type="file"
                    id="video"
                    name="video"
                    accept="video/*"
                    disabled={uploading}
                    className="hidden"
                  />
                  <label
                    htmlFor="video"
                    className="cursor-pointer block"
                  >
                    <svg className="w-12 h-12 mx-auto mb-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-medium mb-1">Click to select video</p>
                    <p className="text-sm text-gray-400">MP4, WebM, or MOV • Max 100MB</p>
                  </label>
                </div>
              </div>

              {/* Progress Bar */}
              {uploading && (
                <div className="space-y-4">
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  'Update Hero Content'
                )}
              </button>
            </form>

            {/* Upload Info */}
            <div className="bg-gray-900/50 rounded-xl p-4 mt-6">
              <h3 className="font-medium mb-3 text-blue-400">Content Guidelines</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Title should be short and impactful (3-5 words)</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Subtitle can be longer to describe your offerings</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Button text should be action-oriented (e.g., "Book Now", "Explore")</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Video should be landscape orientation for best results</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVideoEditor;
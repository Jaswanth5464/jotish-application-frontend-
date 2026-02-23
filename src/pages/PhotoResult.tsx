import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Employee } from '../services/api';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Share2, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function PhotoResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageSrc, employee } = location.state as { imageSrc: string; employee: Employee };
  const [filter, setFilter] = useState('none');
  const [isSaved, setIsSaved] = useState(false);

  if (!imageSrc || !employee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No photo found</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${employee.user_name.replace(/\s+/g, '_')}_profile.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const filters = [
    { name: 'Normal', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(100%)' },
    { name: 'Contrast', value: 'contrast(150%)' },
    { name: 'Brightness', value: 'brightness(120%)' },
    { name: 'Blur', value: 'blur(2px)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Details</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Photo Result</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-8 text-center border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Captured Photo for {employee.user_name}</h2>
            <p className="text-gray-500 mt-2">Review and apply filters before saving.</p>
          </div>

          <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
            {/* Image Preview */}
            <div className="flex-1 w-full">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-gray-100">
                <img 
                  src={imageSrc} 
                  alt={`Captured for ${employee.user_name}`} 
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ filter }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="w-full md:w-80 space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Filters</h3>
                <div className="grid grid-cols-2 gap-3">
                  {filters.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => setFilter(f.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        filter === f.value 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                >
                  {isSaved ? <CheckCircle2 size={20} /> : <Download size={20} />}
                  <span>{isSaved ? 'Saved!' : 'Download Photo'}</span>
                </button>
                
                <button
                  onClick={() => navigate(-1)}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  <RefreshCw size={20} />
                  <span>Retake Photo</span>
                </button>

                <button
                  onClick={() => alert('Sharing functionality mocked for demo.')}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors font-medium"
                >
                  <Share2 size={20} />
                  <span>Share Profile</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

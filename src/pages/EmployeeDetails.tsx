import React, { useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Employee } from '../services/api';
import { motion } from 'motion/react';
import Webcam from 'react-webcam';
import { ArrowLeft, Camera, Mail, MapPin, Briefcase, DollarSign, Calendar, User as UserIcon } from 'lucide-react';

export default function EmployeeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const employee = location.state?.employee as Employee;
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  if (!employee) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Employee not found</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setIsCameraOpen(false);
      navigate(`/photo-result`, { state: { imageSrc, employee } });
    }
  }, [webcamRef, navigate, employee]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Directory</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Cover Photo & Avatar */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center overflow-hidden">
                <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-5xl">
                  {employee.user_name.charAt(0)}
                </div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                employee.user_status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {employee.user_status || 'Active'}
              </span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{employee.user_name}</h1>
                <p className="text-lg text-indigo-600 font-medium mt-1">{employee.user_department}</p>
              </div>
              
              <button
                onClick={() => setIsCameraOpen(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm font-medium"
              >
                <Camera size={20} />
                <span>Capture Photo</span>
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact Information</h3>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail className="text-gray-400" size={20} />
                  <span>{employee.user_email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <MapPin className="text-gray-400" size={20} />
                  <span>{employee.user_city}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Professional Details</h3>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Briefcase className="text-gray-400" size={20} />
                  <span>{employee.user_department}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <DollarSign className="text-gray-400" size={20} />
                  <span>₹{parseInt(employee.user_salary).toLocaleString()} / year</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Personal Details</h3>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Calendar className="text-gray-400" size={20} />
                  <span>{employee.user_age} years old</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <UserIcon className="text-gray-400" size={20} />
                  <span>{employee.user_gender}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full"
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Capture Photo for {employee.user_name}</h3>
              <button 
                onClick={() => setIsCameraOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
            <div className="bg-black relative aspect-video flex items-center justify-center">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex justify-center bg-gray-50">
              <button
                onClick={capture}
                className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg border-4 border-indigo-200"
              >
                <Camera size={28} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

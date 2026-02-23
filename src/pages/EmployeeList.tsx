import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees, Employee } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Search, LogOut, BarChart2, Map as MapIcon, ChevronRight, User } from 'lucide-react';

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to load employees', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredEmployees = (Array.isArray(employees) ? employees : []).filter(emp => 
    emp?.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp?.user_department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp?.user_city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <User className="text-white h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/charts')}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
            >
              <BarChart2 size={18} />
              <span className="hidden sm:inline">Analytics</span>
            </button>
            <button
              onClick={() => navigate('/map')}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
            >
              <MapIcon size={18} />
              <span className="hidden sm:inline">Map View</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Stats */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, department, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-shadow"
            />
          </div>
          
          <div className="flex space-x-4 text-sm text-gray-500">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              Total: <span className="font-semibold text-gray-900">{filteredEmployees.length}</span>
            </div>
          </div>
        </div>

        {/* Employee Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={employee.id}
                onClick={() => navigate(`/employee/${employee.id}`, { state: { employee } })}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                      {employee.user_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {employee.user_name}
                      </h3>
                      <p className="text-sm text-gray-500">{employee.user_department}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">City</p>
                    <p className="text-sm font-medium text-gray-700">{employee.user_city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Salary</p>
                    <p className="text-sm font-medium text-gray-700">₹{parseInt(employee.user_salary).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No employees found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search terms.</p>
          </div>
        )}
      </main>
    </div>
  );
}

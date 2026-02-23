import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees, Employee } from '../services/api';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock coordinates for Indian cities (assuming the API returns Indian cities based on 'jotish.in')
const CITY_COORDINATES: Record<string, [number, number]> = {
  'Mumbai': [19.0760, 72.8777],
  'Delhi': [28.7041, 77.1025],
  'Bangalore': [12.9716, 77.5946],
  'Hyderabad': [17.3850, 78.4867],
  'Chennai': [13.0827, 80.2707],
  'Kolkata': [22.5726, 88.3639],
  'Pune': [18.5204, 73.8567],
  'Ahmedabad': [23.0225, 72.5714],
  'Jaipur': [26.9124, 75.7873],
  'Surat': [21.1702, 72.8311],
  'Lucknow': [26.8467, 80.9462],
  'Kanpur': [26.4499, 80.3319],
  'Nagpur': [21.1458, 79.0882],
  'Indore': [22.7196, 75.8577],
  'Thane': [19.2183, 72.9781],
  'Bhopal': [23.2599, 77.4126],
  'Visakhapatnam': [17.6868, 83.2185],
  'Pimpri-Chinchwad': [18.6298, 73.7997],
  'Patna': [25.5941, 85.1376],
  'Vadodara': [22.3072, 73.1812],
  'Ghaziabad': [28.6692, 77.4538],
  'Ludhiana': [30.9010, 75.8573],
  'Agra': [27.1767, 78.0081],
  'Nashik': [20.0110, 73.7903],
  'Faridabad': [28.4089, 77.3178],
  'Meerut': [28.9845, 77.7064],
  'Rajkot': [22.3039, 70.8022],
  'Kalyan-Dombivli': [19.2403, 73.1305],
  'Vasai-Virar': [19.3919, 72.8397],
  'Varanasi': [25.3176, 82.9739],
  'Srinagar': [34.0837, 74.7973],
  'Aurangabad': [19.8762, 75.3433],
  'Dhanbad': [23.7957, 86.4304],
  'Amritsar': [31.6340, 74.8723],
  'Navi Mumbai': [19.0330, 73.0297],
  'Allahabad': [25.4358, 81.8463],
  'Howrah': [22.5958, 88.2636],
  'Ranchi': [23.3441, 85.3096],
  'Gwalior': [26.2183, 78.1828],
  'Jabalpur': [23.1815, 79.9864],
  'Coimbatore': [11.0168, 76.9558],
  'Vijayawada': [16.5062, 80.6480],
  'Jodhpur': [26.2389, 73.0243],
  'Madurai': [9.9252, 78.1198],
  'Raipur': [21.2514, 81.6296],
  'Kota': [25.2138, 75.8648],
  'Guwahati': [26.1445, 91.7362],
  'Chandigarh': [30.7333, 76.7794],
  'Solapur': [17.6599, 75.9064],
  'Hubli-Dharwad': [15.3647, 75.1240],
  'Bareilly': [28.3670, 79.4304],
  'Moradabad': [28.8386, 78.7733],
  'Mysore': [12.2958, 76.6394],
  'Gurgaon': [28.4595, 77.0266],
  'Aligarh': [27.8974, 78.0880],
  'Jalandhar': [31.3260, 75.5762],
  'Tiruchirappalli': [10.7905, 78.7047],
  'Bhubaneswar': [20.2961, 85.8245],
  'Salem': [11.6643, 78.1460],
  'Mira-Bhayandar': [19.2952, 72.8544],
  'Warangal': [17.9689, 79.5941],
  'Thiruvananthapuram': [8.5241, 76.9366],
  'Bhiwandi': [19.2813, 73.0483],
  'Saharanpur': [29.9640, 77.5460],
  'Guntur': [16.3067, 80.4365],
  'Amravati': [20.9320, 77.7523],
  'Bikaner': [28.0229, 73.3119],
  'Noida': [28.5355, 77.3910],
  'Jamshedpur': [22.8046, 86.2029],
  'Bhilai': [21.1938, 81.3509],
  'Cuttack': [20.4625, 85.8830],
  'Firozabad': [27.1599, 78.3956],
  'Kochi': [9.9312, 76.2673],
  'Bhavnagar': [21.7645, 72.1519],
  'Dehradun': [30.3165, 78.0322],
  'Durgapur': [23.5204, 87.3119],
  'Asansol': [23.6739, 86.9524],
  'Nanded': [19.1383, 77.3210],
  'Kolhapur': [16.7050, 74.2433],
  'Ajmer': [26.4499, 74.6399],
  'Gulbarga': [17.3297, 76.8343],
  'Jamnagar': [22.4707, 70.0577],
  'Ujjain': [23.1765, 75.9261],
  'Loni': [28.7501, 77.2882],
  'Siliguri': [26.7271, 88.3953],
  'Jhansi': [25.4484, 78.5685],
  'Ulhasnagar': [19.2215, 73.1645],
  'Nellore': [14.4426, 79.9865],
  'Jammu': [32.7266, 74.8570],
  'Sangli-Miraj & Kupwad': [16.8524, 74.5815],
  'Belgaum': [15.8497, 74.4977],
  'Mangalore': [12.9141, 74.8560],
  'Ambattur': [13.1143, 80.1548],
  'Tirunelveli': [8.7139, 77.7567],
  'Malegaon': [20.5537, 74.5281],
  'Gaya': [24.7914, 85.0002],
  'Jalgaon': [21.0077, 75.5626],
  'Udaipur': [24.5854, 73.7125],
  'Maheshtala': [22.5097, 88.2541],
};

// Fallback coordinate for unknown cities (center of India)
const DEFAULT_COORD: [number, number] = [20.5937, 78.9629];

export default function EmployeeMap() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const safeEmployees = Array.isArray(employees) ? employees : [];

  // Group employees by city
  const cityGroups = safeEmployees.reduce((acc, emp) => {
    const city = emp.user_city || 'Unknown';
    if (!acc[city]) {
      acc[city] = {
        name: city,
        coordinates: CITY_COORDINATES[city] || [DEFAULT_COORD[0] + (Math.random() - 0.5) * 5, DEFAULT_COORD[1] + (Math.random() - 0.5) * 5], // Add slight random offset for unknown cities to avoid stacking
        employees: [],
      };
    }
    acc[city].employees.push(emp);
    return acc;
  }, {} as Record<string, { name: string; coordinates: [number, number]; employees: Employee[] }>);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Directory</span>
          </button>
          <div className="flex items-center space-x-2">
            <MapPin className="text-indigo-600" size={24} />
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Geographic Distribution</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-0">
        <MapContainer 
          center={[22.5937, 78.9629]} // Center of India
          zoom={5} 
          scrollWheelZoom={true}
          className="w-full h-[calc(100vh-73px)]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {Object.values(cityGroups).map((group: any, index) => (
            <Marker key={index} position={group.coordinates}>
              <Popup className="rounded-xl">
                <div className="p-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{group.name}</h3>
                  <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-3">
                    {group.employees.length} Employee{group.employees.length > 1 ? 's' : ''}
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto pr-2 space-y-2">
                    {group.employees.map((emp: any) => (
                      <div 
                        key={emp.id} 
                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-100 transition-colors"
                        onClick={() => navigate(`/employee/${emp.id}`, { state: { employee: emp } })}
                      >
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{emp.user_name}</p>
                          <p className="text-xs text-gray-500">{emp.user_department}</p>
                        </div>
                        <ArrowLeft size={14} className="text-gray-400 rotate-180" />
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
    </div>
  );
}

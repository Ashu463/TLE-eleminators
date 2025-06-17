import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Plus, Edit2, Trash2, Eye, Download, Settings, Moon, Sun, Calendar, TrendingUp, Award, Activity, Mail, Clock, BarChart3 } from 'lucide-react';

// Theme Context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
  };
  
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={isDark ? 'dark' : ''}>{children}</div>
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

// Mock API Service
const mockAPI = {
  async getStudents() {
    return [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        codeforces_handle: "john_doe",
        current_rating: 1542,
        max_rating: 1689,
        last_updated: "2024-06-15T10:30:00Z",
        email_reminders_sent: 3,
        email_reminders_disabled: false
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+0987654321",
        codeforces_handle: "jane_smith",
        current_rating: 1234,
        max_rating: 1456,
        last_updated: "2024-06-14T08:15:00Z",
        email_reminders_sent: 1,
        email_reminders_disabled: false
      }
    ];
  },
  
  async getContestHistory(studentId, days = 30) {
    console.log(days);
    return [
      {
        id: 1,
        contest_name: "Codeforces Round #892",
        date: "2024-06-10T14:00:00Z",
        rank: 1234,
        rating_change: +42,
        problems_unsolved: 2,
        old_rating: 1500,
        new_rating: 1542
      },
      {
        id: 2,
        contest_name: "Educational Round #142",
        date: "2024-06-05T16:00:00Z",
        rank: 2156,
        rating_change: -28,
        problems_unsolved: 3,
        old_rating: 1528,
        new_rating: 1500
      }
    ];
  },
  
  async getProblemStats(studentId, days = 30) {
    console.log(days);
    return {
      most_difficult_rating: 1600,
      total_problems: 45,
      average_rating: 1234,
      average_per_day: 1.5,
      rating_buckets: {
        "800-900": 5,
        "900-1000": 8,
        "1000-1100": 12,
        "1100-1200": 10,
        "1200-1300": 7,
        "1300-1400": 3
      },
      heatmap_data: generateHeatmapData()
    };
  }
};

function generateHeatmapData() {
  const data = [];
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 5)
    });
  }
  return data.reverse();
}

// Header Component
const Header = ({ currentView, onViewChange }) => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <header className={`border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} px-6 py-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-8 w-8 text-blue-500" />
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Student Progress Management
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="flex space-x-4">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-blue-500 text-white'
                  : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onViewChange('settings')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'settings'
                  ? 'bg-blue-500 text-white'
                  : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </nav>
          
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md transition-colors ${
              isDark ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  const { isDark } = useTheme();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`text-gray-500 hover:text-gray-700 ${isDark ? 'hover:text-gray-300' : ''}`}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Student Form Component
const StudentForm = ({ student, onSubmit, onCancel }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    codeforces_handle: student?.codeforces_handle || ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}
        />
      </div>
      
      <div>
        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}
        />
      </div>
      
      <div>
        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}
        />
      </div>
      
      <div>
        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
          Codeforces Handle
        </label>
        <input
          type="text"
          name="codeforces_handle"
          value={formData.codeforces_handle}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}
        />
      </div>
      
      <div className="flex space-x-2 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          {student ? 'Update' : 'Add'} Student
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Students Table Component
const StudentsTable = ({ students, onAdd, onEdit, onDelete, onViewDetails }) => {
  const { isDark } = useTheme();
  
  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Codeforces Handle', 'Current Rating', 'Max Rating', 'Last Updated'],
      ...students.map(student => [
        student.name,
        student.email,
        student.phone,
        student.codeforces_handle,
        student.current_rating,
        student.max_rating,
        new Date(student.last_updated).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Students ({students.length})
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onAdd}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Student</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Name
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Email
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Phone
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                CF Handle
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Current Rating
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Max Rating
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Last Updated
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {students.map((student) => (
              <tr key={student.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {student.name}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {student.email}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {student.phone}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {student.codeforces_handle}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {student.current_rating}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    {student.max_rating}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {new Date(student.last_updated).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetails(student)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(student)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Rating Chart Component (simplified)
const RatingChart = ({ contests }) => {
  const { isDark } = useTheme();
  console.log('Contests:', contests);
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg`}>
      <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Rating Progress
      </h3>
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Rating chart would be rendered here
          </p>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Use Chart.js or Recharts for actual implementation
          </p>
        </div>
      </div>
    </div>
  );
};

// Problem Stats Component
const ProblemStats = ({ stats }) => {
  const { isDark } = useTheme();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Most Difficult</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.most_difficult_rating}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Solved</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.total_problems}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avg Rating</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.average_rating}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Per Day</p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stats.average_per_day}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
        <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Problems by Rating
        </h4>
        <div className="space-y-2">
          {Object.entries(stats.rating_buckets).map(([range, count]) => (
            <div key={range} className="flex items-center">
              <div className={`w-20 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {range}
              </div>
              <div className="flex-1 mx-4">
                <div className={`h-4 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className="h-4 bg-blue-500 rounded-full"
                    style={{ width: `${(count / Math.max(...Object.values(stats.rating_buckets))) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className={`w-8 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
        <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Submission Heatmap
        </h4>
        <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Heatmap visualization would be here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Student Profile Component
const StudentProfile = ({ student, onBack }) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('contests');
  const [contestFilter, setContestFilter] = useState(30);
  const [problemFilter, setProblemFilter] = useState(30);
  const [contests, setContests] = useState([]);
  const [problemStats, setProblemStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [contestData, statsData] = await Promise.all([
          mockAPI.getContestHistory(student.id, contestFilter),
          mockAPI.getProblemStats(student.id, problemFilter)
        ]);
        setContests(contestData);
        setProblemStats(statsData);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [student.id, contestFilter, problemFilter]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading student data...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            ← Back to Students
          </button>
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {student.name}
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {student.codeforces_handle} • Current: {student.current_rating} • Max: {student.max_rating}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Reminders sent: {student.email_reminders_sent}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Updated: {new Date(student.last_updated).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('contests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Contest History
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'problems'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Problem Solving
          </button>
        </nav>
      </div>
      
      {activeTab === 'contests' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Filter by:
            </label>
            <select
              value={contestFilter}
              onChange={(e) => setContestFilter(Number(e.target.value))}
              className={`px-3 py-1 border rounded-md ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last 365 days</option>
            </select>
          </div>
          
          <RatingChart contests={contests} />
          
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recent Contests
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Contest
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Date
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Rank
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Rating Change
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                      Unsolved
                    </th>
                  </tr>
                </thead>
                <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {contests.map((contest) => (
                    <tr key={contest.id}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {contest.contest_name}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        {new Date(contest.date).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        #{contest.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          contest.rating_change >= 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {contest.rating_change >= 0 ? '+' : ''}{contest.rating_change}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                        {contest.problems_unsolved}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'problems' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Filter by:
            </label>
            <select
              value={problemFilter}
              onChange={(e) => setProblemFilter(Number(e.target.value))}
              className={`px-3 py-1 border rounded-md ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          
          {problemStats && <ProblemStats stats={problemStats} />}
        </div>
      )}
    </div>
  );
};

// Settings Component
// const Settings = () => {
//   const { isDark } = useTheme();
//   const [cronTime, setCronTime] = useState('02:00');
//   const [cronFrequency, setCronFrequency] = useState('daily');
//   const [emailSettings, setEmailSettings] = useState({
//     enabled: true,
//     inactivityDays: 7
//   });
  
//   const handleSaveSettings = () => {
//     // Save settings logic here
//     alert('Settings saved successfully!');
//   };
  
//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
//         Settings
//       </h2>
      
//       <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
//         <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//           Data Sync Settings
//         </h3>
        
//         <div className="space-y-4">
//           <div>
//             <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
//               Sync Time
//             </label>
//             <input
//               type="time"
//               value={cronTime}
//               onChange={(e) => setCronTime(e.target.value)}
//               className={`px-3 py-2 border rounded-md ${
//                 isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
//               }`}
//             />
//           </div>
          
//           <div>
//             <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
//               Sync Frequency
//             </label>
//             <select
//               value={cronFrequency}
//               onChange={(e) => setCronFrequency(e.target.value)}
//               className={`px-3 py-2 border rounded-md ${
//                 isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
//               }`}
//             >
//               <option value="daily">Daily</option>
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//             </select>
//           </div>
//         </div>
//       </div>
      
//       <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
//         <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
//           Email Reminder Settings
//         </h3>
        
//         <div className="space-y-4">
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="emailEnabled"
//               checked={emailSettings.enabled}
//               onChange={(e) => setEmailSettings({
//                 ...emailSettings,
//                 enabled: e.target.checked
//               })}
//               className="mr-2"
//             />
//             <label htmlFor="emailEnabled" className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
//               Enable automatic email reminders
//             </label>
//           </div>
          
//           <div>
//             <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
//               Send reminder after (days of inactivity)
//             </label>
//             <input
//               type="number"
//               min="1"
//               max="30"
//               value={emailSettings.inactivityDays}
//               onChange={(e) => setEmailSettings({
//                 ...emailSettings,
//                 inactivityDays: parseInt(e.target.value)
//               })}
//               className={`px-3 py-2 border rounded-md ${
//                 isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
//               }`}
//             />
//           </div>
//         </div>
//       </div>
      
//       <div className="flex justify-end">
//         <button
//           onClick={handleSaveSettings}
//           className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//         >
//           Save Settings
//         </button>
//       </div>
//     </div>
//   );
// };


export {
  ThemeProvider,
  Header,
  Modal,
  StudentForm,
  StudentsTable,
  RatingChart,
  ProblemStats,
  StudentProfile,
  // Settings
};
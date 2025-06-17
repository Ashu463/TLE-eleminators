import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Plus, Edit2, Trash2, Eye, Download, Moon, Sun, Calendar, TrendingUp, Award, Activity, Mail, Clock, BarChart3 } from 'lucide-react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  
  async getContestHistory(cf_handle, days) {
  try {
    const response = await axios.get(`http://localhost:3000/api/students/${cf_handle}`);
    const ratingHistory = response.data.data.ratingHistory;
    console.log(response, " is the whole response")
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000; // in ms

    const filtered = ratingHistory.filter(entry => {
      const contestTime = entry.ratingUpdateTimeSeconds * 1000; // convert to ms
      return contestTime >= cutoff;
    });

    const contestHistory = filtered.map((entry, index) => ({
      id: index + 1,
      contest_name: entry.contestName,
      date: new Date(entry.ratingUpdateTimeSeconds * 1000).toISOString(),
      rank: entry.rank,
      rating_change: entry.newRating - entry.oldRating,
      problems_unsolved: Math.floor(Math.random() * 4),
      old_rating: entry.oldRating,
      new_rating: entry.newRating
    }));

    return contestHistory;
  } catch (error) {
    console.error('Failed to fetch contest history:', error);
    return [];
  }
},
async getProblemStats(cf_handle, days) {
  try {
    const response = await axios.get(`http://localhost:3000/api/students/${cf_handle}`);
    const ratingHistory = response.data.data.ratingHistory;
    const submissions = response.data.data.submissions;

    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    const filtered = ratingHistory.filter(entry => {
      const contestTime = entry.ratingUpdateTimeSeconds * 1000;
      return contestTime >= cutoff;
    });

    const ratingBuckets = {
      "800-900": 0,
      "900-1000": 0,
      "1000-1100": 0,
      "1100-1200": 0,
      "1200-1300": 0,
      "1300-1400": 0
    };

    let totalProblems = 0;
    let totalRating = 0;
    let mostDifficult = 0;

    for (const entry of filtered) {
      const rating = entry.newRating;
      totalProblems++;
      totalRating += rating;
      mostDifficult = Math.max(mostDifficult, rating);

      if (rating >= 800 && rating < 900) ratingBuckets["800-900"]++;
      else if (rating >= 900 && rating < 1000) ratingBuckets["900-1000"]++;
      else if (rating >= 1000 && rating < 1100) ratingBuckets["1000-1100"]++;
      else if (rating >= 1100 && rating < 1200) ratingBuckets["1100-1200"]++;
      else if (rating >= 1200 && rating < 1300) ratingBuckets["1200-1300"]++;
      else if (rating >= 1300 && rating < 1400) ratingBuckets["1300-1400"]++;
    }

    const averageRating = totalProblems > 0 ? Math.round(totalRating / totalProblems) : 0;
    const averagePerDay = +(totalProblems / days).toFixed(1);

    return {
      most_difficult_rating: mostDifficult,
      total_problems: totalProblems,
      average_rating: averageRating,
      average_per_day: averagePerDay,
      rating_buckets: ratingBuckets,
      heatmap_data: generateHeatmapFromSubmissions(submissions, days)
    };

  } catch (error) {
    console.error('Failed to fetch problem stats:', error);
    return {
      most_difficult_rating: 0,
      total_problems: 0,
      average_rating: 0,
      average_per_day: 0,
      rating_buckets: {},
      heatmap_data: []
    };
  }
}
};

function generateHeatmapFromSubmissions(submissions, days = 365) {
  const heatmap = {};
  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000;

  submissions.forEach(sub => {
    if (sub.verdict !== 'OK') return;
    const subDate = new Date(sub.creationTimeSeconds * 1000);
    if (subDate.getTime() < cutoff) return;

    const dateStr = subDate.toISOString().split('T')[0];
    heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
  });

  return Object.entries(heatmap).map(([date, count]) => ({ date, count }));
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
      
      <div className="flex space-x-2 pt-4" onClick={async()=>{
        if (!student) {
          // Add new student
          console.log("Post request is gonna sent for creating new user")
          try{
            await axios.post('http://localhost:3000/api/students', {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              codeforces_handle: formData.codeforces_handle
            })
            alert("Student added successfully");
          }catch(error){
            alert("Error adding student: codeforces handle does not exist" + error.message);
          }
        } else {
          // Update existing student
          try{
            axios.put('http://localhost:3000/api/students/' + student._id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          codeforces_handle: formData.codeforces_handle
        }).then(response => {
          console.log("Student updated successfully", response.data);
        }).catch(error => {
          console.error("Error updating student", error);
        });
          }catch(error){
            alert("Error adding student: " + error.message);
          }
      }
      }}>
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
                      onClick={async ()=>{
                        await axios.delete('http://localhost:3000/api/students/' + student._id)
                        console.log("Student deleted successfully", student._id);

                      }} 
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
  const chartData = contests.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    rating: entry.new_rating
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Rating Progress</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="rating" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Problem Stats Component
const ProblemStats = ({ stats }) => {
  const { isDark } = useTheme();
  console.log(stats, " is the stats object");
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
          <Heatmap heatmapData={stats.heatmap_data} />
        <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />

          </div>
        </div>
      </div>
    </div>
  );
};

const Heatmap = ({ heatmapData }) => {
  const today = new Date();
  const yearAgo = new Date();
  yearAgo.setFullYear(today.getFullYear() - 1);

  return (
    <CalendarHeatmap
      startDate={yearAgo}
      endDate={today}
      values={heatmapData}
      classForValue={value => {
        if (!value || value.count === 0) return 'color-empty';
        if (value.count < 2) return 'color-scale-1';
        if (value.count < 4) return 'color-scale-2';
        if (value.count < 6) return 'color-scale-3';
        return 'color-scale-4';
      }}
      tooltipDataAttrs={value =>
        value.date
          ? {
              'data-tip': `${value.date} — ${value.count} submissions`
            }
          : {}
      }
      showWeekdayLabels
    />
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
          mockAPI.getContestHistory(student.codeforces_handle, contestFilter),
          mockAPI.getProblemStats(student.codeforces_handle, problemFilter)
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
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last 365 days</option>
            </select>
          </div>
          
          {problemStats && <ProblemStats stats={problemStats} />}
        </div>
      )}
    </div>
  );
};

// Settings Component
const Settings = () => {
  const { isDark } = useTheme();
  const [cronTime, setCronTime] = useState('02:00');
  const [cronFrequency, setCronFrequency] = useState('daily');
  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    inactivityDays: 7
  });
  
  const handleSaveSettings = () => {
    // Save settings logic here
    alert('Settings saved successfully!');
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Settings
      </h2>
      
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Data Sync Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Sync Time
            </label>
            <input
              type="time"
              value={cronTime}
              onChange={(e) => setCronTime(e.target.value)}
              className={`px-3 py-2 border rounded-md ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Sync Frequency
            </label>
            <select
              value={cronFrequency}
              onChange={(e) => setCronFrequency(e.target.value)}
              className={`px-3 py-2 border rounded-md ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Email Reminder Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailEnabled"
              checked={emailSettings.enabled}
              onChange={(e) => setEmailSettings({
                ...emailSettings,
                enabled: e.target.checked
              })}
              className="mr-2"
            />
            <label htmlFor="emailEnabled" className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Enable automatic email reminders
            </label>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Send reminder after (days of inactivity)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={emailSettings.inactivityDays}
              onChange={(e) => setEmailSettings({
                ...emailSettings,
                inactivityDays: parseInt(e.target.value)
              })}
              className={`px-3 py-2 border rounded-md ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await axios.get('http://localhost:3000/api/students');
        console.log('Fetched students:', data);
        setStudents(data.data);

      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);
  
  const handleAddStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: Date.now(),
      current_rating: 0,
      max_rating: 0,
      last_updated: new Date().toISOString(),
      email_reminders_sent: 0,
      email_reminders_disabled: false
    };
    setStudents([...students, newStudent]);
    setShowAddModal(false);
  };
  
  const handleEditStudent = (studentData) => {
    setStudents(students.map(student => 
      student.id === editingStudent.id 
        ? { ...student, ...studentData }
        : student
    ));
    setShowEditModal(false);
    setEditingStudent(null);
  };
  
  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      axios.delete(`http://localhost:3000/api/students/${studentId}`)
    }
  };
  
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };
  
  const handleBack = () => {
    setSelectedStudent(null);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      {/* <Router>
        <Route path={'/dashboard'} element={<Dashboard></Dashboard>} />
        <Route path={'/settings'} element={<Settings></Settings>} />
        <Route path={'/Profile'} element={<Profile></Profile>} />
      </Router> */}
      
      <main className="container mx-auto px-6 py-8">
        {currentView === 'dashboard' && !selectedStudent && (
          <StudentsTable
            students={students}
            onAdd={() => {
              setShowAddModal(true)

            }}
            onEdit={(student) => {
              setEditingStudent(student);
              setShowEditModal(true);
            }}
            onDelete={handleDeleteStudent}
            onViewDetails={handleViewDetails}
          />
        )}
        
        {currentView === 'dashboard' && selectedStudent && (
          <StudentProfile
            student={selectedStudent}
            onBack={handleBack}
          />
        )}
        
        {currentView === 'settings' && <Settings />}
      </main>
      
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Student"
      >
        <StudentForm
          onSubmit={handleAddStudent}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
      
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingStudent(null);
        }}
        title="Edit Student"
      >
        <StudentForm
          student={editingStudent}
          onSubmit={handleEditStudent}
          onCancel={() => {
            setShowEditModal(false);
            setEditingStudent(null);
          }}
        />
      </Modal>
    </div>
  );
};

// Main Component with Theme Provider
export default function StudentProgressSystem() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
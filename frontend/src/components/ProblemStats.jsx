import React from 'react';
import { Award, Activity, BarChart3, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Heatmap from './Heatmap';

const ProblemStats = ({ stats }) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Award className="h-8 w-8 text-yellow-500 mr-3" />} label="Most Difficult" value={stats.most_difficult_rating} />
        <StatCard icon={<Activity className="h-8 w-8 text-blue-500 mr-3" />} label="Total Solved" value={stats.total_problems} />
        <StatCard icon={<BarChart3 className="h-8 w-8 text-green-500 mr-3" />} label="Avg Rating" value={stats.average_rating} />
        <StatCard icon={<Calendar className="h-8 w-8 text-purple-500 mr-3" />} label="Per Day" value={stats.average_per_day} />
      </div>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
        <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Problems by Rating</h4>
        <div className="space-y-2">
          {Object.entries(stats.rating_buckets).map(([range, count]) => (
            <div key={range} className="flex items-center">
              <div className={`w-20 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{range}</div>
              <div className="flex-1 mx-4">
                <div className={`h-4 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className="h-4 bg-blue-500 rounded-full"
                    style={{ width: `${(count / Math.max(...Object.values(stats.rating_buckets))) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className={`w-8 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
        <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Submission Heatmap</h4>
        <Heatmap heatmapData={stats.heatmap_data} />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => {
  const { isDark } = useTheme();

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow`}>
      <div className="flex items-center">
        {icon}
        <div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default ProblemStats;

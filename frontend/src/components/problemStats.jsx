import useTheme from '../hooks/useTheme';


export const ProblemStats = ({ stats }) => {
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
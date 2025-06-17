import useTheme from '../hooks/useTheme';
export const Header = ({ currentView, onViewChange }) => {
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
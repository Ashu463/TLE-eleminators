import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const AppContent = () => {
  const { isDark } = useTheme();

  return (
    <>
      <Header />
      <main className={`min-h-screen px-6 py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile/:handle" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;

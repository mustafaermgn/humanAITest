import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CodeAnalyzer from './components/CodeAnalyzer';
import History from './components/History';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import HistoryDetail from './components/HistoryDetail';
import './index.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Add dark class to body for Shadcn theme
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <div className="animated-background opacity-20" />
      <Router>
        <div className="relative flex min-h-screen flex-col">
          <Navigation onMenuClick={() => setSidebarOpen(true)} />
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          <main className="flex-1">
            <div className="container relative py-6 md:py-10">
              <Routes>
                <Route path="/" element={<CodeAnalyzer />} />
                <Route path="/history" element={<History />} />
                <Route path="/history/:id" element={<HistoryDetail />} />
              </Routes>
            </div>
          </main>
          
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;

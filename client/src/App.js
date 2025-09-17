import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AdminProvider } from './context/AdminContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Feedback from './pages/Feedback';
import Admin from './pages/Admin';
import { ThankYou } from './components/feedback';

function App() {
  return (
    <AdminProvider>
      <Router>
        <div className="min-h-screen bg-prometheus-dark flex flex-col">
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#2d2d2d',
                color: '#ffffff',
                border: '1px solid #404040'
              },
              success: {
                iconTheme: {
                  primary: '#ff6600',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          
          <Header />
          
          <main className="flex-1 safe-area-top safe-area-bottom">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AdminProvider>
  );
}

export default App;

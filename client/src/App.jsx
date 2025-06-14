import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Components
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import VehiclesPage from './pages/Services/VehiclesPage'
import LicensesPage from './pages/Services/LicensesPage'
import TransportPage from './pages/Services/TransportPage'
import SupportPage from './pages/SupportPage'
import AdminPage from './pages/Admin/AdminPage'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import LoadingSpinner from './components/UI/LoadingSpinner'

function App() {
  const { loading } = useSelector((state) => state.auth)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/services/vehicles" element={
            <ProtectedRoute>
              <VehiclesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/services/licenses" element={
            <ProtectedRoute>
              <LicensesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/services/transport" element={
            <ProtectedRoute>
              <TransportPage />
            </ProtectedRoute>
          } />
          
          <Route path="/support" element={
            <ProtectedRoute>
              <SupportPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="Admin">
              <AdminPage />
            </ProtectedRoute>
          } />
          
          {/* 404 Page */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Page not found</p>
                <a 
                  href="/" 
                  className="btn btn-primary"
                >
                  Return Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App 
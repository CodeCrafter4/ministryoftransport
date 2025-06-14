import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkAdminAuth } from './store/slices/authSlice'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import UserManagement from './pages/UserManagement'
import VehicleManagement from './pages/VehicleManagement'
import LicenseManagement from './pages/LicenseManagement'
import TransportManagement from './pages/TransportManagement'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAdminAuth())
  }, [dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <AdminLogin />
        } 
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/vehicles" element={<VehicleManagement />} />
                <Route path="/licenses" element={<LicenseManagement />} />
                <Route path="/transport" element={<TransportManagement />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App 
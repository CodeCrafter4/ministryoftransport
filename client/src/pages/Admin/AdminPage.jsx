import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import UserManagement from './UserManagement'
import VehicleManagement from './VehicleManagement'
import LicenseManagement from './LicenseManagement'
import TransportManagement from './TransportManagement'
import AdminLayout from '../../components/Admin/AdminLayout'

const AdminPage = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/vehicles" element={<VehicleManagement />} />
        <Route path="/licenses" element={<LicenseManagement />} />
        <Route path="/transport" element={<TransportManagement />} />
      </Routes>
    </AdminLayout>
  )
}

export default AdminPage

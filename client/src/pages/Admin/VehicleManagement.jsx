import React, { useState, useEffect } from 'react'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalVehicles, setTotalVehicles] = useState(0)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [adminNote, setAdminNote] = useState('')

  useEffect(() => {
    fetchVehicles()
  }, [currentPage, searchTerm, statusFilter, typeFilter])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })

      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter) params.append('status', statusFilter)
      if (typeFilter) params.append('vehicleType', typeFilter)

      const response = await fetch(`/api/vehicles?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setVehicles(data.vehicles || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalVehicles(data.total || 0)
      } else {
        throw new Error('Failed to fetch vehicles')
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast.error('Failed to fetch vehicle applications')
      // Mock data fallback
      setVehicles([
        {
          _id: '1',
          make: 'Toyota',
          model: 'Camry',
          year: 2022,
          vehicleType: 'Private Car',
          registrationNumber: 'ABC-123',
          engineNumber: 'ENG123456',
          chassisNumber: 'CHS789012',
          applicationType: 'New Registration',
          status: 'Pending',
          submissionDate: '2024-06-08T00:00:00.000Z',
          user: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890'
          }
        },
        {
          _id: '2',
          make: 'Honda',
          model: 'Civic',
          year: 2021,
          vehicleType: 'Private Car',
          registrationNumber: 'XYZ-789',
          engineNumber: 'ENG789012',
          chassisNumber: 'CHS345678',
          applicationType: 'Renewal',
          status: 'Approved',
          submissionDate: '2024-06-07T00:00:00.000Z',
          user: {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '+0987654321'
          }
        }
      ])
      setTotalVehicles(2)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (vehicleId, newStatus) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast.success('Vehicle status updated successfully')
        fetchVehicles()
        setShowVehicleModal(false)
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error)
      toast.error('Failed to update vehicle status')
    }
  }

  const handleAddNote = async () => {
    if (!adminNote.trim()) {
      toast.error('Please enter a note')
      return
    }

    try {
      const response = await fetch(`/api/vehicles/${selectedVehicle._id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          note: adminNote,
          isPublic: true
        })
      })

      if (response.ok) {
        toast.success('Note added successfully')
        setAdminNote('')
        setShowNotesModal(false)
        fetchVehicles()
      } else {
        throw new Error('Failed to add note')
      }
    } catch (error) {
      console.error('Error adding note:', error)
      toast.error('Failed to add note')
    }
  }

  const viewVehicleDetails = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleModal(true)
  }

  const openNotesModal = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowNotesModal(true)
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Under Review': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Completed': 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  const getApplicationTypeBadge = (type) => {
    const typeClasses = {
      'New Registration': 'bg-purple-100 text-purple-800',
      'Renewal': 'bg-indigo-100 text-indigo-800',
      'Transfer': 'bg-orange-100 text-orange-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeClasses[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
        <p className="text-gray-600 mt-2">Review and manage vehicle registration applications</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Search Vehicles</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by make, model, registration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="form-label">Vehicle Type</label>
            <select
              className="form-input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Private Car">Private Car</option>
              <option value="Commercial Vehicle">Commercial Vehicle</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Bus">Bus</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setCurrentPage(1)
                fetchVehicles()
              }}
              className="btn-primary w-full"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{totalVehicles}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.filter(v => v.status === 'Pending' || v.status === 'Under Review').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.filter(v => v.status === 'Approved' || v.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.filter(v => v.status === 'Rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.make} {vehicle.model} ({vehicle.year})
                          </div>
                          <div className="text-sm text-gray-500">
                            Reg: {vehicle.registrationNumber || 'Pending'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.vehicleType}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vehicle.user?.firstName} {vehicle.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.user?.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.user?.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getApplicationTypeBadge(vehicle.applicationType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(vehicle.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(vehicle.submissionDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => viewVehicleDetails(vehicle)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openNotesModal(vehicle)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Note
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Vehicle Details Modal */}
      {showVehicleModal && selectedVehicle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Vehicle Application Details</h3>
              <button
                onClick={() => setShowVehicleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vehicle Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Vehicle Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Make & Model</label>
                    <p className="text-gray-900">{selectedVehicle.make} {selectedVehicle.model}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Year</label>
                    <p className="text-gray-900">{selectedVehicle.year}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vehicle Type</label>
                    <p className="text-gray-900">{selectedVehicle.vehicleType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Number</label>
                    <p className="text-gray-900">{selectedVehicle.registrationNumber || 'Pending'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Engine Number</label>
                    <p className="text-gray-900">{selectedVehicle.engineNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Chassis Number</label>
                    <p className="text-gray-900">{selectedVehicle.chassisNumber}</p>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Owner Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedVehicle.user?.firstName} {selectedVehicle.user?.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedVehicle.user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedVehicle.user?.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">National ID</label>
                    <p className="text-gray-900">{selectedVehicle.user?.nationalId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Actions */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Update Status</h4>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleStatusUpdate(selectedVehicle._id, 'Under Review')}
                  className="btn-secondary"
                  disabled={selectedVehicle.status === 'Under Review'}
                >
                  Under Review
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedVehicle._id, 'Approved')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  disabled={selectedVehicle.status === 'Approved'}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedVehicle._id, 'Rejected')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  disabled={selectedVehicle.status === 'Rejected'}
                >
                  Reject
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedVehicle._id, 'Completed')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={selectedVehicle.status === 'Completed'}
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedVehicle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add Admin Note</h3>
              <button
                onClick={() => setShowNotesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 text-sm">
                Vehicle: {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
              </p>
              <p className="text-gray-600 text-sm">
                Owner: {selectedVehicle.user?.firstName} {selectedVehicle.user?.lastName}
              </p>
            </div>

            <div className="mb-4">
              <label className="form-label">Admin Note</label>
              <textarea
                className="form-input"
                rows="4"
                placeholder="Enter your note here..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowNotesModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="btn-primary"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VehicleManagement
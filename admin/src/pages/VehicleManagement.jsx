import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
  Car, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Hash,
  MapPin
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const VehicleManagement = () => {
  const { token } = useSelector((state) => state.auth)
  const [vehicles, setVehicles] = useState([])
  const [filteredVehicles, setFilteredVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('view') // 'view', 'edit', 'notes'
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0
  })
  const [adminNote, setAdminNote] = useState('')

  useEffect(() => {
    fetchVehicles()
    fetchStats()
  }, [currentPage])

  useEffect(() => {
    filterVehicles()
  }, [vehicles, searchTerm, filterStatus])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vehicles?page=${currentPage}&limit=20`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setVehicles(data.vehicles || [])
        setTotalPages(Math.ceil((data.total || 0) / 20))
      } else {
        console.error('Failed to fetch vehicles')
        setVehicles([])
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/vehicles/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || {})
      }
    } catch (error) {
      console.error('Error fetching vehicle stats:', error)
    }
  }

  const filterVehicles = () => {
    let filtered = vehicles

    if (searchTerm) {
      filtered = filtered.filter(vehicle => 
        vehicle.vehicleDetails?.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleDetails?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === filterStatus)
    }

    setFilteredVehicles(filtered)
  }

  const openModal = (type, vehicle = null) => {
    setModalType(type)
    setSelectedVehicle(vehicle)
    setAdminNote('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedVehicle(null)
    setModalType('view')
    setAdminNote('')
  }

  const updateVehicleStatus = async (vehicleId, newStatus, rejectReason = '') => {
    try {
      const body = { status: newStatus }
      if (rejectReason) {
        body.rejectionReason = rejectReason
      }

      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        fetchVehicles()
        fetchStats()
        closeModal()
        alert(`Vehicle application ${newStatus.toLowerCase()} successfully!`)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update vehicle status')
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error)
      alert('An error occurred while updating vehicle status')
    }
  }

  const addAdminNote = async (vehicleId, note) => {
    try {
      const response = await fetch(`/api/vehicles/${vehicleId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note })
      })

      if (response.ok) {
        fetchVehicles()
        setAdminNote('')
        alert('Admin note added successfully!')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to add admin note')
      }
    } catch (error) {
      console.error('Error adding admin note:', error)
      alert('An error occurred while adding admin note')
    }
  }

  const deleteVehicle = async (vehicleId, vehicleInfo) => {
    if (window.confirm(`Are you sure you want to delete vehicle "${vehicleInfo}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/vehicles/${vehicleId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (response.ok) {
          fetchVehicles()
          fetchStats()
          alert('Vehicle deleted successfully')
        } else {
          const error = await response.json()
          alert(error.message || 'Failed to delete vehicle')
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error)
        alert('An error occurred while deleting vehicle')
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      case 'Under Review':
        return 'bg-blue-100 text-blue-800'
      case 'Completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-3 w-3" />
      case 'Pending':
        return <Clock className="h-3 w-3" />
      case 'Rejected':
        return <XCircle className="h-3 w-3" />
      case 'Under Review':
        return <AlertCircle className="h-3 w-3" />
      case 'Completed':
        return <Check className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Car className="h-8 w-8 text-primary-600" />
            Vehicle Management
          </h1>
          <p className="text-gray-600 mt-1">Manage vehicle registration applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
            </div>
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved || 0}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected || 0}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-600">{stats.completed || 0}</p>
            </div>
            <Check className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by vehicle details, plate number, owner name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field pl-10 pr-4"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="card">
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {vehicle.vehicleDetails?.make} {vehicle.vehicleDetails?.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vehicle.vehicleDetails?.year} • {vehicle.registrationNumber || 'Pending'}
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                      {getStatusIcon(vehicle.status)}
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.registrationNumber ? (
                      <div className="flex items-center gap-1">
                        <Hash className="h-4 w-4 text-gray-400" />
                        {vehicle.registrationNumber}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatDate(vehicle.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('view', vehicle)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {vehicle.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => updateVehicleStatus(vehicle._id, 'Approved')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve Application"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Please enter rejection reason:')
                              if (reason) {
                                updateVehicleStatus(vehicle._id, 'Rejected', reason)
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Reject Application"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openModal('notes', vehicle)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Add Note"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteVehicle(
                          vehicle._id, 
                          `${vehicle.vehicleDetails?.make} ${vehicle.vehicleDetails?.model} (${vehicle.registrationNumber || 'Pending'})`
                        )}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Application"
                      >
                        <Trash2 className="h-4 w-4" />
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
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    const pageNumber = index + 1
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === 'view' && 'Vehicle Application Details'}
                {modalType === 'notes' && 'Admin Notes'}
              </h3>
            </div>

            <div className="p-6">
              {modalType === 'view' && (
                <div className="space-y-6">
                  {/* Owner Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Owner Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <p className="text-sm text-gray-900">{selectedVehicle.user?.firstName} {selectedVehicle.user?.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <p className="text-sm text-gray-900">{selectedVehicle.user?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <p className="text-sm text-gray-900">{selectedVehicle.user?.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                        <p className="text-sm text-gray-900">{selectedVehicle.user?.nationalId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      Vehicle Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Make & Model</label>
                        <p className="text-sm text-gray-900">{selectedVehicle.vehicleDetails?.make} {selectedVehicle.vehicleDetails?.model}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <p className="text-sm text-gray-900">{selectedVehicle.vehicleDetails?.year}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <p className="text-sm text-gray-900">{selectedVehicle.vehicleDetails?.color}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                        <p className="text-sm text-gray-900">{selectedVehicle.registrationNumber || 'Pending'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                        <p className="text-sm text-gray-900">{selectedVehicle.vehicleDetails?.vin}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
                        <p className="text-sm text-gray-900">{selectedVehicle.vehicleDetails?.engineNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Application Status */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Application Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedVehicle.status)}`}>
                          {getStatusIcon(selectedVehicle.status)}
                          {selectedVehicle.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedVehicle.createdAt)}</p>
                      </div>
                      {selectedVehicle.registrationNumber && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                          <p className="text-sm text-gray-900">{selectedVehicle.registrationNumber || 'Pending'}</p>
                        </div>
                      )}
                      {selectedVehicle.reviewDate && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Review Date</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedVehicle.reviewDate)}</p>
                        </div>
                      )}
                      {selectedVehicle.rejectionReason && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{selectedVehicle.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {selectedVehicle.adminNotes && selectedVehicle.adminNotes.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Admin Notes</h4>
                      <div className="space-y-3">
                        {selectedVehicle.adminNotes.map((note, index) => (
                          <div key={index} className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium text-blue-900">
                                {note.addedBy?.firstName} {note.addedBy?.lastName}
                              </span>
                              <span className="text-xs text-blue-600">
                                {formatDate(note.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-blue-800">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  {selectedVehicle.status === 'Pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => updateVehicleStatus(selectedVehicle._id, 'Approved')}
                        className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Approve Application
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Please enter rejection reason:')
                          if (reason) {
                            updateVehicleStatus(selectedVehicle._id, 'Rejected', reason)
                          }
                        }}
                        className="btn-primary bg-red-600 hover:bg-red-700 flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Reject Application
                      </button>
                    </div>
                  )}
                </div>
              )}

              {modalType === 'notes' && (
                <div className="space-y-6">
                  {/* Existing Notes */}
                  {selectedVehicle.adminNotes && selectedVehicle.adminNotes.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Existing Notes</h4>
                      <div className="space-y-3 mb-6">
                        {selectedVehicle.adminNotes.map((note, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-medium text-gray-900">
                                {note.addedBy?.firstName} {note.addedBy?.lastName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(note.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Note */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Add New Note</h4>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Enter admin note..."
                      rows={4}
                      className="input-field"
                    />
                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={() => {
                          if (adminNote.trim()) {
                            addAdminNote(selectedVehicle._id, adminNote.trim())
                          }
                        }}
                        disabled={!adminNote.trim()}
                        className="btn-primary disabled:opacity-50"
                      >
                        Add Note
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VehicleManagement 
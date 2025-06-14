import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
  Truck, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Clock,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Navigation,
  Route,
  Play,
  Pause,
  Square,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const TransportManagement = () => {
  const { token } = useSelector((state) => state.auth)
  const [routes, setRoutes] = useState([])
  const [filteredRoutes, setFilteredRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('view') // 'view', 'edit', 'create'
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    totalRoutes: 0,
    activeRoutes: 0,
    totalTrips: 0,
    totalPassengers: 0,
    revenue: 0
  })
  const [routeForm, setRouteForm] = useState({
    routeName: '',
    routeNumber: '',
    routeType: 'City Bus',
    origin: '',
    destination: '',
    distance: '',
    duration: '',
    fare: '',
    schedule: [],
    vehicle: {
      vehicleNumber: '',
      capacity: '',
      type: 'Bus'
    },
    driver: {
      name: '',
      licenseNumber: '',
      contactNumber: ''
    },
    status: 'Active',
    operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  })

  useEffect(() => {
    fetchRoutes()
    fetchStats()
  }, [currentPage])

  useEffect(() => {
    filterRoutes()
  }, [routes, searchTerm, filterStatus, filterType])

  const fetchRoutes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/transport/routes?page=${currentPage}&limit=20`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setRoutes(data.routes || [])
        setTotalPages(Math.ceil((data.total || 0) / 20))
      } else {
        console.error('Failed to fetch routes')
        setRoutes([])
      }
    } catch (error) {
      console.error('Error fetching routes:', error)
      setRoutes([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/transport/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats || {})
      }
    } catch (error) {
      console.error('Error fetching transport stats:', error)
    }
  }

  const filterRoutes = () => {
    let filtered = routes

    if (searchTerm) {
      filtered = filtered.filter(route => 
        route.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.routeNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(route => route.status === filterStatus)
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(route => route.routeType === filterType)
    }

    setFilteredRoutes(filtered)
  }

  const openModal = (type, route = null) => {
    setModalType(type)
    if (route) {
      setSelectedRoute(route)
      if (type === 'edit') {
        setRouteForm({
          routeName: route.routeName || '',
          routeNumber: route.routeNumber || '',
          routeType: route.routeType || 'City Bus',
          origin: route.origin || '',
          destination: route.destination || '',
          distance: route.distance || '',
          duration: route.duration || '',
          fare: route.fare || '',
          schedule: route.schedule || [],
          vehicle: {
            vehicleNumber: route.vehicle?.vehicleNumber || '',
            capacity: route.vehicle?.capacity || '',
            type: route.vehicle?.type || 'Bus'
          },
          driver: {
            name: route.driver?.name || '',
            licenseNumber: route.driver?.licenseNumber || '',
            contactNumber: route.driver?.contactNumber || ''
          },
          status: route.status || 'Active',
          operatingDays: route.operatingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        })
      }
    } else {
      setSelectedRoute(null)
      setRouteForm({
        routeName: '',
        routeNumber: '',
        routeType: 'City Bus',
        origin: '',
        destination: '',
        distance: '',
        duration: '',
        fare: '',
        schedule: [],
        vehicle: {
          vehicleNumber: '',
          capacity: '',
          type: 'Bus'
        },
        driver: {
          name: '',
          licenseNumber: '',
          contactNumber: ''
        },
        status: 'Active',
        operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRoute(null)
    setModalType('view')
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('vehicle.')) {
      const vehicleField = name.split('.')[1]
      setRouteForm(prev => ({
        ...prev,
        vehicle: {
          ...prev.vehicle,
          [vehicleField]: value
        }
      }))
    } else if (name.startsWith('driver.')) {
      const driverField = name.split('.')[1]
      setRouteForm(prev => ({
        ...prev,
        driver: {
          ...prev.driver,
          [driverField]: value
        }
      }))
    } else if (name === 'operatingDays') {
      setRouteForm(prev => ({
        ...prev,
        operatingDays: checked 
          ? [...prev.operatingDays, value]
          : prev.operatingDays.filter(day => day !== value)
      }))
    } else {
      setRouteForm(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = modalType === 'create' ? '/api/transport/routes' : `/api/transport/routes/${selectedRoute._id}`
      const method = modalType === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(routeForm)
      })

      if (response.ok) {
        closeModal()
        fetchRoutes()
        fetchStats()
        alert(modalType === 'create' ? 'Route created successfully!' : 'Route updated successfully!')
      } else {
        const error = await response.json()
        alert(error.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred')
    }
  }

  const updateRouteStatus = async (routeId, newStatus) => {
    try {
      const response = await fetch(`/api/transport/routes/${routeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        fetchRoutes()
        fetchStats()
        alert(`Route ${newStatus.toLowerCase()} successfully!`)
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to update route status')
      }
    } catch (error) {
      console.error('Error updating route status:', error)
      alert('An error occurred while updating route status')
    }
  }

  const deleteRoute = async (routeId, routeName) => {
    if (window.confirm(`Are you sure you want to delete route "${routeName}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/transport/routes/${routeId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (response.ok) {
          fetchRoutes()
          fetchStats()
          alert('Route deleted successfully')
        } else {
          const error = await response.json()
          alert(error.message || 'Failed to delete route')
        }
      } catch (error) {
        console.error('Error deleting route:', error)
        alert('An error occurred while deleting route')
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Inactive':
        return 'bg-red-100 text-red-800'
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'Suspended':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <Play className="h-3 w-3" />
      case 'Inactive':
        return <Square className="h-3 w-3" />
      case 'Maintenance':
        return <AlertTriangle className="h-3 w-3" />
      case 'Suspended':
        return <Pause className="h-3 w-3" />
      default:
        return <Square className="h-3 w-3" />
    }
  }

  const getRouteTypeIcon = (type) => {
    switch (type) {
      case 'City Bus':
        return <Truck className="h-4 w-4 text-blue-600" />
      case 'Metro':
        return <Route className="h-4 w-4 text-green-600" />
      case 'Express':
        return <Navigation className="h-4 w-4 text-red-600" />
      case 'Shuttle':
        return <Truck className="h-4 w-4 text-purple-600" />
      default:
        return <Truck className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount)
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
            <Truck className="h-8 w-8 text-primary-600" />
            Transport Management
          </h1>
          <p className="text-gray-600 mt-1">Manage public transport routes and schedules</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Route
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Routes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRoutes || 0}</p>
            </div>
            <Route className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Routes</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeRoutes || 0}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Trips</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalTrips || 0}</p>
            </div>
            <Navigation className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Passengers</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalPassengers || 0}</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Revenue</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.revenue || 0)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-emerald-600" />
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
              placeholder="Search by route name, number, origin, destination..."
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="relative">
            <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field pl-10 pr-4"
            >
              <option value="all">All Types</option>
              <option value="City Bus">City Bus</option>
              <option value="Metro">Metro</option>
              <option value="Express">Express</option>
              <option value="Shuttle">Shuttle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle & Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoutes.map((route) => (
                <tr key={route._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center gap-2">
                        {getRouteTypeIcon(route.routeType)}
                        <span className="text-sm font-medium text-gray-900">{route.routeName}</span>
                      </div>
                      <div className="text-sm text-gray-500">#{route.routeNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {route.origin} → {route.destination}
                      </div>
                      <div className="text-sm text-gray-500">
                        {route.distance}km • {route.duration} • {formatCurrency(route.fare)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        Vehicle: {route.vehicle?.vehicleNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        Driver: {route.driver?.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                      {getStatusIcon(route.status)}
                      {route.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {route.schedule && route.schedule.length > 0 ? (
                      <div className="space-y-1">
                        <div>First: {formatTime(route.schedule[0].departureTime)}</div>
                        <div>Last: {formatTime(route.schedule[route.schedule.length - 1].departureTime)}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">No schedule</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('view', route)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openModal('edit', route)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit Route"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      {route.status === 'Active' ? (
                        <button
                          onClick={() => updateRouteStatus(route._id, 'Inactive')}
                          className="text-orange-600 hover:text-orange-900"
                          title="Deactivate Route"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateRouteStatus(route._id, 'Active')}
                          className="text-green-600 hover:text-green-900"
                          title="Activate Route"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteRoute(route._id, route.routeName)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Route"
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === 'view' && 'Route Details'}
                {modalType === 'edit' && 'Edit Route'}
                {modalType === 'create' && 'Create New Route'}
              </h3>
            </div>

            <div className="p-6">
              {modalType === 'view' && selectedRoute && (
                <div className="space-y-6">
                  {/* Route Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Route className="h-5 w-5" />
                      Route Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                        <p className="text-sm text-gray-900">{selectedRoute.routeName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Route Number</label>
                        <p className="text-sm text-gray-900">{selectedRoute.routeNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <div className="flex items-center gap-2">
                          {getRouteTypeIcon(selectedRoute.routeType)}
                          <span className="text-sm text-gray-900">{selectedRoute.routeType}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRoute.status)}`}>
                          {getStatusIcon(selectedRoute.status)}
                          {selectedRoute.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                        <p className="text-sm text-gray-900">{selectedRoute.origin}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                        <p className="text-sm text-gray-900">{selectedRoute.destination}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                        <p className="text-sm text-gray-900">{selectedRoute.distance} km</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <p className="text-sm text-gray-900">{selectedRoute.duration}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fare</label>
                        <p className="text-sm text-gray-900">{formatCurrency(selectedRoute.fare)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Operating Days</label>
                        <p className="text-sm text-gray-900">{selectedRoute.operatingDays?.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle & Driver */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Vehicle & Driver
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                        <p className="text-sm text-gray-900">{selectedRoute.vehicle?.vehicleNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                        <p className="text-sm text-gray-900">{selectedRoute.vehicle?.type}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <p className="text-sm text-gray-900">{selectedRoute.vehicle?.capacity} passengers</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                        <p className="text-sm text-gray-900">{selectedRoute.driver?.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Driver License</label>
                        <p className="text-sm text-gray-900">{selectedRoute.driver?.licenseNumber}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Driver Contact</label>
                        <p className="text-sm text-gray-900">{selectedRoute.driver?.contactNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  {selectedRoute.schedule && selectedRoute.schedule.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Schedule
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedRoute.schedule.map((trip, index) => (
                            <div key={index} className="text-center">
                              <div className="text-sm font-medium text-gray-900">
                                {formatTime(trip.departureTime)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Trip {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(modalType === 'edit' || modalType === 'create') && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route Name *</label>
                      <input
                        type="text"
                        name="routeName"
                        value={routeForm.routeName}
                        onChange={handleFormChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route Number *</label>
                      <input
                        type="text"
                        name="routeNumber"
                        value={routeForm.routeNumber}
                        onChange={handleFormChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route Type *</label>
                      <select
                        name="routeType"
                        value={routeForm.routeType}
                        onChange={handleFormChange}
                        required
                        className="input-field"
                      >
                        <option value="City Bus">City Bus</option>
                        <option value="Metro">Metro</option>
                        <option value="Express">Express</option>
                        <option value="Shuttle">Shuttle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                      <select
                        name="status"
                        value={routeForm.status}
                        onChange={handleFormChange}
                        required
                        className="input-field"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Origin *</label>
                      <input
                        type="text"
                        name="origin"
                        value={routeForm.origin}
                        onChange={handleFormChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                      <input
                        type="text"
                        name="destination"
                        value={routeForm.destination}
                        onChange={handleFormChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km) *</label>
                      <input
                        type="number"
                        name="distance"
                        value={routeForm.distance}
                        onChange={handleFormChange}
                        required
                        min="0"
                        step="0.1"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <input
                        type="text"
                        name="duration"
                        value={routeForm.duration}
                        onChange={handleFormChange}
                        required
                        placeholder="e.g., 45 minutes"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fare (SAR) *</label>
                      <input
                        type="number"
                        name="fare"
                        value={routeForm.fare}
                        onChange={handleFormChange}
                        required
                        min="0"
                        step="0.01"
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label>
                        <input
                          type="text"
                          name="vehicle.vehicleNumber"
                          value={routeForm.vehicle.vehicleNumber}
                          onChange={handleFormChange}
                          required
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
                        <select
                          name="vehicle.type"
                          value={routeForm.vehicle.type}
                          onChange={handleFormChange}
                          required
                          className="input-field"
                        >
                          <option value="Bus">Bus</option>
                          <option value="Minibus">Minibus</option>
                          <option value="Van">Van</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                        <input
                          type="number"
                          name="vehicle.capacity"
                          value={routeForm.vehicle.capacity}
                          onChange={handleFormChange}
                          required
                          min="1"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Driver Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Driver Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name *</label>
                        <input
                          type="text"
                          name="driver.name"
                          value={routeForm.driver.name}
                          onChange={handleFormChange}
                          required
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                        <input
                          type="text"
                          name="driver.licenseNumber"
                          value={routeForm.driver.licenseNumber}
                          onChange={handleFormChange}
                          required
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                        <input
                          type="tel"
                          name="driver.contactNumber"
                          value={routeForm.driver.contactNumber}
                          onChange={handleFormChange}
                          required
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operating Days */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Operating Days</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <div key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            name="operatingDays"
                            value={day}
                            checked={routeForm.operatingDays.includes(day)}
                            onChange={handleFormChange}
                            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <label className="ml-2 block text-sm text-gray-700">{day}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {modalType === 'create' ? 'Create Route' : 'Update Route'}
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'view' && (
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransportManagement 
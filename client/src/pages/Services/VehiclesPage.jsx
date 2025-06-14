import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const VehiclesPage = () => {
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('new-registration')
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register: registerForm,
    handleSubmit: handleNewSubmit,
    formState: { errors: newErrors },
    reset: resetNew
  } = useForm()

  const {
    register: renewForm,
    handleSubmit: handleRenewSubmit,
    formState: { errors: renewErrors },
    reset: resetRenew
  } = useForm()

  // Fetch user's vehicles
  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await api.get('/vehicles/my-vehicles')
      setVehicles(response.data.vehicles || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast.error('Failed to fetch vehicles')
    } finally {
      setLoading(false)
    }
  }

  const onNewRegistration = async (data) => {
    try {
      setSubmitting(true)
      // Add application type for new registration
      const submissionData = {
        ...data,
        applicationType: 'New Registration'
      }
      console.log('Submitting vehicle data:', submissionData)
      const response = await api.post('/vehicles', submissionData)
      toast.success('Vehicle registration submitted successfully!')
      resetNew()
      fetchVehicles()
      setActiveTab('my-vehicles')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  const onRenewal = async (data) => {
    try {
      setSubmitting(true)
      // Add application type for renewal
      const submissionData = {
        ...data,
        applicationType: 'Renewal'
      }
      console.log('Submitting renewal data:', submissionData)
      const response = await api.post('/vehicles', submissionData)
      toast.success('Vehicle renewal submitted successfully!')
      resetRenew()
      fetchVehicles()
      setActiveTab('my-vehicles')
    } catch (error) {
      console.error('Renewal error:', error)
      toast.error(error.response?.data?.message || 'Renewal failed')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const tabs = [
    {
      id: 'new-registration',
      label: 'New Registration',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      id: 'renewal',
      label: 'Renewal',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      id: 'my-vehicles',
      label: 'My Vehicles',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Services</h1>
          <p className="text-gray-600">Manage your vehicle registrations and renewals</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* New Registration Tab */}
            {activeTab === 'new-registration' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">New Vehicle Registration</h2>
                  <p className="text-gray-600">Register a new vehicle with the Ministry of Transport</p>
                </div>

                <form onSubmit={handleNewSubmit(onNewRegistration)} className="space-y-6">
                  {/* Vehicle Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">Vehicle Type</label>
                        <select
                          {...registerForm('vehicleType', { required: 'Vehicle type is required' })}
                          className="form-select"
                        >
                          <option value="">Select vehicle type</option>
                          <option value="Car">Car</option>
                          <option value="Motorcycle">Motorcycle</option>
                          <option value="Truck">Truck</option>
                          <option value="Bus">Bus</option>
                          <option value="Van">Van</option>
                          <option value="Other">Other</option>
                        </select>
                        {newErrors.vehicleType && (
                          <p className="form-error">{newErrors.vehicleType.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Make</label>
                        <input
                          {...registerForm('make', { required: 'Make is required' })}
                          type="text"
                          className="form-input"
                          placeholder="e.g. Toyota, Honda"
                        />
                        {newErrors.make && (
                          <p className="form-error">{newErrors.make.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Model</label>
                        <input
                          {...registerForm('model', { required: 'Model is required' })}
                          type="text"
                          className="form-input"
                          placeholder="e.g. Corolla, Civic"
                        />
                        {newErrors.model && (
                          <p className="form-error">{newErrors.model.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Year</label>
                        <input
                          {...registerForm('year', {
                            required: 'Year is required',
                            min: { value: 1900, message: 'Invalid year' },
                            max: { value: new Date().getFullYear() + 1, message: 'Invalid year' }
                          })}
                          type="number"
                          className="form-input"
                          placeholder="e.g. 2020"
                        />
                        {newErrors.year && (
                          <p className="form-error">{newErrors.year.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Color</label>
                        <input
                          {...registerForm('color', { required: 'Color is required' })}
                          type="text"
                          className="form-input"
                          placeholder="e.g. White, Black"
                        />
                        {newErrors.color && (
                          <p className="form-error">{newErrors.color.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Engine Number</label>
                        <input
                          {...registerForm('engineNumber', { required: 'Engine number is required' })}
                          type="text"
                          className="form-input"
                          placeholder="Engine identification number"
                        />
                        {newErrors.engineNumber && (
                          <p className="form-error">{newErrors.engineNumber.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Chassis Number</label>
                        <input
                          {...registerForm('chassisNumber', { required: 'Chassis number is required' })}
                          type="text"
                          className="form-input"
                          placeholder="Vehicle identification number"
                        />
                        {newErrors.chassisNumber && (
                          <p className="form-error">{newErrors.chassisNumber.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Fuel Type</label>
                        <select
                          {...registerForm('fuelType', { required: 'Fuel type is required' })}
                          className="form-select"
                        >
                          <option value="">Select fuel type</option>
                          <option value="Gasoline">Gasoline</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Electric">Electric</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="LPG">LPG</option>
                        </select>
                        {newErrors.fuelType && (
                          <p className="form-error">{newErrors.fuelType.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Owner Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Owner Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">Owner Name</label>
                        <input
                          {...registerForm('ownerName', { required: 'Owner name is required' })}
                          type="text"
                          className="form-input"
                          defaultValue={`${user?.firstName} ${user?.lastName}`}
                        />
                        {newErrors.ownerName && (
                          <p className="form-error">{newErrors.ownerName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Contact Phone</label>
                        <input
                          {...registerForm('ownerPhone', { required: 'Phone number is required' })}
                          type="tel"
                          className="form-input"
                          defaultValue={user?.phone}
                        />
                        {newErrors.ownerPhone && (
                          <p className="form-error">{newErrors.ownerPhone.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="form-label">Owner Address</label>
                        <textarea
                          {...registerForm('ownerAddress', { required: 'Address is required' })}
                          rows={3}
                          className="form-textarea"
                          defaultValue={user?.address}
                        />
                        {newErrors.ownerAddress && (
                          <p className="form-error">{newErrors.ownerAddress.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Registration Purpose */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Registration Purpose</h3>
                    <div>
                      <label className="form-label">Purpose of Registration</label>
                      <select
                        {...registerForm('purpose', { required: 'Purpose is required' })}
                        className="form-select"
                      >
                        <option value="">Select purpose</option>
                        <option value="Personal">Personal Use</option>
                        <option value="Commercial">Commercial Use</option>
                        <option value="Government">Government Use</option>
                        <option value="Diplomatic">Diplomatic Use</option>
                      </select>
                      {newErrors.purpose && (
                        <p className="form-error">{newErrors.purpose.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary px-8 py-3"
                    >
                      {submitting ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="small" className="mr-2" />
                          Submitting...
                        </div>
                      ) : (
                        'Submit Registration'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Renewal Tab */}
            {activeTab === 'renewal' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Vehicle Registration Renewal</h2>
                  <p className="text-gray-600">Renew your existing vehicle registration</p>
                </div>

                <form onSubmit={handleRenewSubmit(onRenewal)} className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="form-label">Registration Number</label>
                        <input
                          {...renewForm('registrationNumber', { required: 'Registration number is required' })}
                          type="text"
                          className="form-input"
                          placeholder="Enter current registration number"
                        />
                        {renewErrors.registrationNumber && (
                          <p className="form-error">{renewErrors.registrationNumber.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Vehicle Identification Number</label>
                        <input
                          {...renewForm('chassisNumber', { required: 'VIN is required' })}
                          type="text"
                          className="form-input"
                          placeholder="Vehicle identification number"
                        />
                        {renewErrors.chassisNumber && (
                          <p className="form-error">{renewErrors.chassisNumber.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Current Owner Name</label>
                        <input
                          {...renewForm('ownerName', { required: 'Owner name is required' })}
                          type="text"
                          className="form-input"
                          defaultValue={`${user?.firstName} ${user?.lastName}`}
                        />
                        {renewErrors.ownerName && (
                          <p className="form-error">{renewErrors.ownerName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label">Contact Phone</label>
                        <input
                          {...renewForm('ownerPhone', { required: 'Phone number is required' })}
                          type="tel"
                          className="form-input"
                          defaultValue={user?.phone}
                        />
                        {renewErrors.ownerPhone && (
                          <p className="form-error">{renewErrors.ownerPhone.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="form-label">Renewal Reason</label>
                        <select
                          {...renewForm('renewalReason', { required: 'Renewal reason is required' })}
                          className="form-select"
                        >
                          <option value="">Select renewal reason</option>
                          <option value="Expiration">Registration Expiration</option>
                          <option value="Lost">Lost Registration Document</option>
                          <option value="Damaged">Damaged Registration Document</option>
                          <option value="Change">Change of Information</option>
                        </select>
                        {renewErrors.renewalReason && (
                          <p className="form-error">{renewErrors.renewalReason.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary px-8 py-3"
                    >
                      {submitting ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="small" className="mr-2" />
                          Submitting...
                        </div>
                      ) : (
                        'Submit Renewal'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* My Vehicles Tab */}
            {activeTab === 'my-vehicles' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">My Vehicles</h2>
                  <p className="text-gray-600">View and manage your registered vehicles</p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="large" />
                  </div>
                ) : vehicles.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles registered</h3>
                    <p className="text-gray-600 mb-4">You haven't registered any vehicles yet.</p>
                    <button
                      onClick={() => setActiveTab('new-registration')}
                      className="btn-primary"
                    >
                      Register Your First Vehicle
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                            {vehicle.status || 'Pending'}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Registration:</span>
                            <span className="text-gray-900">{vehicle.registrationNumber || 'Pending'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Year:</span>
                            <span className="text-gray-900">{vehicle.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Type:</span>
                            <span className="text-gray-900">{vehicle.vehicleType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Color:</span>
                            <span className="text-gray-900">{vehicle.color}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Applied:</span>
                            <span className="text-gray-900">
                              {new Date(vehicle.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehiclesPage 
import React from 'react'

const TransportManagement = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transport Management</h1>
        <p className="text-gray-600 mt-2">Manage public transport routes, schedules, and real-time information</p>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-8 text-center">
        <div className="mx-auto h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Transport Management</h3>
        <p className="text-gray-600 mb-4">
          This section will allow admins to create and manage public transport routes, update schedules, and provide real-time updates.
        </p>
        <p className="text-sm text-gray-500">
          Features include route creation, schedule management, real-time tracking, and passenger information systems.
        </p>
      </div>
    </div>
  )
}

export default TransportManagement 
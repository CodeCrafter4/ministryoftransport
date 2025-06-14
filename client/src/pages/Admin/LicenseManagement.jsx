import React from 'react'

const LicenseManagement = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">License Management</h1>
        <p className="text-gray-600 mt-2">Review and manage driver license applications</p>
      </div>

      <div className="bg-white rounded-xl shadow-soft p-8 text-center">
        <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">License Management</h3>
        <p className="text-gray-600 mb-4">
          This section will allow admins to review driver license applications, manage test schedules, and approve license issuance.
        </p>
        <p className="text-sm text-gray-500">
          Similar to Vehicle Management but focused on driver licenses, test results, and license classes.
        </p>
      </div>
    </div>
  )
}

export default LicenseManagement

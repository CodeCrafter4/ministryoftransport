import React from 'react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to Ministry of Transport & Logistics
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your one-stop platform for all transportation services including vehicle registration, 
            driver's license applications, and public transport information.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Registration</h3>
              <p className="text-gray-600">Register your vehicle and manage your registration documents online.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Driver's License</h3>
              <p className="text-gray-600">Apply for new licenses, renewals, and track your application status.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Public Transport</h3>
              <p className="text-gray-600">Get real-time information about public transportation services.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage 
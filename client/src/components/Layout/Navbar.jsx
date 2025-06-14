import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    toast.success('Logged out successfully')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home', public: true },
    { path: '/dashboard', label: 'Dashboard', auth: true },
    { path: '/services/vehicles', label: 'Vehicles', auth: true },
    { path: '/services/licenses', label: 'Licenses', auth: true },
    { path: '/services/transport', label: 'Transport', auth: true },
  ]

  const adminLinks = [
    { path: '/admin', label: 'Admin Panel', role: 'Admin' }
  ]

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Ministry of Transport</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              if (link.auth && !isAuthenticated) return null
              if (link.public || (link.auth && isAuthenticated)) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              }
              return null
            })}

            {/* Admin Links */}
            {isAuthenticated && user?.role === 'Admin' && (
              adminLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))
            )}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 text-white hover:text-blue-200 focus:outline-none"
                >
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <span className="text-sm">{user?.firstName} {user?.lastName}</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-gray-500">{user?.email}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        user?.role === 'Admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user?.role}
                      </span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        handleLogout()
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-blue-100 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => {
                if (link.auth && !isAuthenticated) return null
                if (link.public || (link.auth && isAuthenticated)) {
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive(link.path)
                          ? 'bg-blue-700 text-white'
                          : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                }
                return null
              })}

              {/* Mobile Admin Links */}
              {isAuthenticated && user?.role === 'Admin' && (
                adminLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))
              )}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-blue-500">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-blue-100">
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-blue-200">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-500 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleLogout()
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-500 hover:text-white transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-blue-500 text-white hover:bg-blue-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 
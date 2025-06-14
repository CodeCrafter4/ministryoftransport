const express = require('express');
const router = express.Router();

// Import controllers
const {
  createVehicleApplication,
  getVehicleApplications,
  getVehicleApplication,
  updateVehicleApplication,
  addAdminNote,
  deleteVehicleApplication,
  getVehicleStats
} = require('../controllers/vehicleController');

// Import middleware
const { protect, authorize } = require('../middleware/auth');
const {
  validateVehicleRegistration,
  validateObjectId,
  validatePagination,
  validateAdminNote
} = require('../middleware/validation');

// Get vehicle statistics (Admin only) - Must be before /:id route
router.get('/stats', protect, authorize('Admin'), getVehicleStats);

// Get user's vehicles - Must be before /:id route
router.get('/my-vehicles', protect, getVehicleApplications);

// Public user and admin routes
router.route('/')
  .get(protect, validatePagination, getVehicleApplications)
  .post(protect, validateVehicleRegistration, createVehicleApplication);

router.route('/:id')
  .get(protect, validateObjectId, getVehicleApplication)
  .put(protect, validateObjectId, updateVehicleApplication)
  .delete(protect, validateObjectId, deleteVehicleApplication);

// Admin only routes
router.post('/:id/notes', protect, authorize('Admin'), validateObjectId, validateAdminNote, addAdminNote);

module.exports = router; 
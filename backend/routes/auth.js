const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
    body('name').notEmpty().withMessage('Bank name is required'),
    body('bankId').notEmpty().withMessage('Bank ID is required'),
    body('branch').notEmpty().withMessage('Branch is required')
], authController.registerBank);

router.post('/login', [
    body('employeeId').notEmpty().withMessage('Employee ID is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.employeeLogin);

router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
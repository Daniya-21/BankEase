const express = require('express');
const { body } = require('express-validator');
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', complaintController.getComplaints);
router.get('/:id', complaintController.getComplaint);
router.post('/', [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('userName').notEmpty().withMessage('User name is required'),
    body('userEmail').isEmail().withMessage('Valid email is required')
], complaintController.createComplaint);
router.put('/:id', complaintController.updateComplaint);
router.post('/ai-classify', complaintController.aiClassifyComplaint);

module.exports = router;
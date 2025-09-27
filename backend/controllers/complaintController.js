const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { classifyComplaint } = require('../utils/aiClassifier');

exports.getComplaints = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            priority, 
            category, 
            assignedTo,
            startDate,
            endDate 
        } = req.query;

        const filter = { bankId: req.user.bankId };

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (category) filter.category = category;
        if (assignedTo) filter.assignedTo = assignedTo;
        
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: [
                { path: 'assignedTo', select: 'name email' },
                { path: 'resolution.resolvedBy', select: 'name' }
            ]
        };

        const complaints = await Complaint.paginate(filter, options);

        res.json({
            success: true,
            data: complaints
        });

    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching complaints',
            error: error.message
        });
    }
};

exports.getComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('assignedTo', 'name email team')
            .populate('resolution.resolvedBy', 'name');

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        if (complaint.bankId.toString() !== req.user.bankId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: { complaint }
        });

    } catch (error) {
        console.error('Get complaint error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching complaint',
            error: error.message
        });
    }
};

exports.createComplaint = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const complaintData = {
            ...req.body,
            bankId: req.user.bankId,
            userId: req.user.id
        };

        // AI Classification
        complaintData.aiClassification = classifyComplaint(complaintData.description);

        const complaint = new Complaint(complaintData);
        await complaint.save();

        await complaint.populate('assignedTo', 'name email');

        res.status(201).json({
            success: true,
            message: 'Complaint created successfully',
            data: { complaint }
        });

    } catch (error) {
        console.error('Create complaint error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating complaint',
            error: error.message
        });
    }
};

exports.updateComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        if (complaint.bankId.toString() !== req.user.bankId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        Object.assign(complaint, req.body);
        await complaint.save();

        await complaint.populate('assignedTo', 'name email');

        res.json({
            success: true,
            message: 'Complaint updated successfully',
            data: { complaint }
        });

    } catch (error) {
        console.error('Update complaint error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating complaint',
            error: error.message
        });
    }
};

exports.aiClassifyComplaint = async (req, res) => {
    try {
        const { description } = req.body;

        const aiClassification = classifyComplaint(description);

        res.json({
            success: true,
            data: { aiClassification }
        });

    } catch (error) {
        console.error('AI classification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in AI classification',
            error: error.message
        });
    }
};
const User = require('../models/User');
const Bank = require('../models/Bank');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.registerBank = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, bankId, branch, address, contact } = req.body;

        const existingBank = await Bank.findOne({ bankId });
        if (existingBank) {
            return res.status(400).json({
                success: false,
                message: 'Bank with this ID already exists'
            });
        }

        const bank = new Bank({
            name,
            bankId,
            branch,
            address,
            contact
        });

        await bank.save();

        res.status(201).json({
            success: true,
            message: 'Bank registered successfully',
            data: { bank }
        });

    } catch (error) {
        console.error('Bank registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering bank',
            error: error.message
        });
    }
};

exports.employeeLogin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { employeeId, password } = req.body;

        const user = await User.findOne({ employeeId }).populate('bankId');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    employeeId: user.employeeId,
                    name: user.name,
                    email: user.email,
                    team: user.team,
                    bank: user.bankId
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('bankId').select('-password');
        
        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};
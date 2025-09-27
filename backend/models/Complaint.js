const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    complaintId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['account', 'transaction', 'card', 'loan', 'digital-banking', 'fraud', 'other']
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved', 'closed'],
        default: 'pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedTeam: {
        type: String,
        enum: ['customer-support', 'it-support', 'operations', 'compliance-fraud', 'product-service']
    },
    aiClassification: {
        category: String,
        sentiment: String,
        complexity: String,
        riskLevel: String,
        confidence: Number
    },
    resolution: {
        description: String,
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        resolvedAt: Date,
        notes: String
    },
    bankId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank',
        required: true
    },
    source: {
        type: String,
        enum: ['web', 'email', 'phone', 'imported', 'manual'],
        default: 'manual'
    },
    attachments: [{
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

complaintSchema.pre('save', async function(next) {
    if (this.isNew) {
        const count = await mongoose.model('Complaint').countDocuments();
        this.complaintId = `COMP${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

complaintSchema.index({ status: 1, priority: 1, createdAt: -1 });
complaintSchema.index({ bankId: 1, createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
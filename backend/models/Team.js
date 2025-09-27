const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['customer-support', 'it-support', 'operations', 'compliance-fraud', 'product-service']
    },
    displayName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    teamLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    capacity: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },
    currentWorkload: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['available', 'busy', 'overloaded', 'maintenance'],
        default: 'available'
    },
    performance: {
        resolutionRate: { type: Number, default: 0 },
        avgResolutionTime: { type: Number, default: 0 },
        satisfactionScore: { type: Number, default: 0 }
    },
    bankId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank',
        required: true
    }
}, {
    timestamps: true
});

teamSchema.virtual('availableCapacity').get(function() {
    return Math.max(0, this.capacity - this.currentWorkload);
});

teamSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Team', teamSchema);
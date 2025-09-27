const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    bankId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    branch: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    contact: {
        phone: String,
        email: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bank', bankSchema);
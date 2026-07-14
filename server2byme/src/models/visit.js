const mongoose = require('mongoose');
const OPTIONS = require('../config/Options');

const visitSchema = mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        shopName: {
            type: String,
        },
        customerName: {
            type: String,
        },
        imageUrl: {
            type: String,
            require: false,
        },
        phoneNumber: {
            type: Number,
        },

        typeOfVisit: {
            type: String,
            enum: OPTIONS.visitType.getAllVisitAsArray(),
            default: OPTIONS.visitType.NEW,
        },

        inVoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoice',
        },

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        position: {
            lat: {
                type: Number,
                required: true,  // Mark as required if necessary
            },
            lng: {
                type:Number,
                required: true,  // Mark as required if necessary
            },
        },
    },
    {
        timestamps: true,
        collection: 'Visit',
    }
);

// Pre-save hook to validate fields based on visitType
visitSchema.pre('save', function (next) {
    const visit = this;
console.log("validator running before save",this)
    if (visit.typeOfVisit === OPTIONS.visitType.COLLECTION) {
        // For COLLECTION type, invoiceId and customerId are required
        if (!visit.inVoiceId || !visit.customerId) {
            return next(new Error('invoiceId and customerId are required for COLLECTION visits.'));
        }
    } else if (visit.typeOfVisit === OPTIONS.visitType.ORDER) {
        // For FOLLOW_UP type, only customerId is required
        if (!visit.customerId) {
            return next(new Error('customerId is required for FOLLOW_UP visits.'));
        }
        visit.inVoiceId = undefined; // Ensure invoiceId is not set for FOLLOW_UP
    } else if (visit.typeOfVisit === OPTIONS.visitType.NEW) {
        // For NEW type, customerId should not be present, but shopName, ownerName, phoneNumber are required
        if (visit.customerId) {
            return next(new Error('customerId should not be present for NEW visits.'));
        }
        if ( !visit.phoneNumber) {
            return next(new Error('shopName, ownerName, and phoneNumber are required for NEW visits.'));
        }
        visit.invoiceId = undefined; // Ensure invoiceId is not set for NEW
    }

    next();
});

const Visit = mongoose.model('Visit', visitSchema);
module.exports = Visit;

import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
    bookingStartDate: {
        type: Date,
        required: true
    },
    bookingEndDate: {
        type: Date,
        required: true
    },
    itemId: [{
        _id: {
            type: ObjectId,
            ref: 'Item',
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    }],
    memberId: [{
        type: ObjectId,
        ref: 'Member'
    }],
    bankId: [{
        type: ObjectId,
        ref: 'Bank'
    }],
    proofPayment: {
        type: String,
        required: true
    },
    bankFrom: {
        type: String,
        required: true
    },
    accountHolder: {
        type: String,
        require: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
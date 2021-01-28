import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Memeber', memberSchema);
const mongoose = require('mongoose');

const Enterprise = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        image: {
            type: String,
        },
        heading: {
            type: String,
            required: true
        },
        ruc: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model('Enterprise', Enterprise);
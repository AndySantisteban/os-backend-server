const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        products: [
            {
                productId: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                enterprice: {
                    type: String,
                    required: true,
                }
            },
        ],
    },
    { timestamps: true }
);


module.exports = mongoose.model('Cart', CartSchema);
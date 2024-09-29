import mongoose from "mongoose";

const paysSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    information:{
        type: String,
        required: [true, 'Information is required']
    },
    quantity:{
        type: Number,
        required: [true, 'Quantity is required']
    },
    startDate:{
        type: Date,
        required: [true, 'Start date is required'],
        default: Date.now
    },
    finishDate:{
        type: Date,
        required: [true, 'Finish date is required'],
    },
    state: {
        type: String,
        enum: ['PENDING', 'PAID', 'CANCELLED'],
        default: 'PENDING'
    },
    payMethod: {
        type: String,
        enum: ['CASH', 'CARD'],
    }
});

paysSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export const PaysModel = mongoose.model('Pays', paysSchema);
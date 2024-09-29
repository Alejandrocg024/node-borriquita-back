import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start Date is required']
    },    
    endDate: {
        type: Date,
        required: [true, 'End Date is required']
    },
    allDay: {
        type: Boolean,
        required: [true, 'All Day is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    location: {
        type: String,
    }

});

eventSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export const EventModel = mongoose.model('Event', eventSchema);
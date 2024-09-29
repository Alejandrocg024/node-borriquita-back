import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    publicationDate: {
        type: Date,
        required: [true, 'Publication Date is required'],
        default: Date.now
    },
    modificationDate: {
        type: Date,
        default: Date.now
    },
    available:{
        type: Boolean,
        default: false
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: [true, 'Body is required']
    },
    media:{
        type: String,
    }

});

announcementSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export const AnnouncementModel = mongoose.model('Announcement', announcementSchema);

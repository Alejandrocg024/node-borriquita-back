import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    dni: {
        type: String,
        required: [true, 'DNI is required'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    birthDate: {
        type: Date,
        required: [true, 'Birthdate is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    emailValidated: {
        type: Boolean,
        default: false
    },
    admissionDate: {
        type: Date,
        required: [true, 'Admission Date is required'],
        default: Date.now
    },
    outDate: {
        type: Date,
    },
    address: {
        type: String,
    },
    role: {
        type: String,
        enum: ['ADMIN_ROLE', 'MAYORDOMIA_ROLE', 'COMUNICACIONES_ROLE'],
    },
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
    }
});

export const UserModel = mongoose.model('User', userSchema);

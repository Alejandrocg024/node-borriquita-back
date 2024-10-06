import mongoose from "mongoose";

const respuestaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
      type: Date,
      default: Date.now,
        required: true
    },
    details: {
      type: String,
      required: true,
    }
  });

const requestFormSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['BAJA', 'ASIGNACIÓN', 'CONSULTA', 'OTROS'],
        required: [true, 'Type is required']
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    details: {
        type: String,
        required: [true, 'Detail is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String
    },
    answers:{
        type: [respuestaSchema],
        default: []
    }
});

requestFormSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export const RequestFormModel = mongoose.model('RequestForm', requestFormSchema);



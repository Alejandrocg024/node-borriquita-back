import mongoose from "mongoose";

export class Validators {
    static isMongoID(id: string): boolean {
        return mongoose.isValidObjectId(id);
    }
}
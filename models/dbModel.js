import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

export const collection = mongoose.model(`collection`, productSchema)
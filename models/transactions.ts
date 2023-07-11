import { Schema, Types, model } from 'mongoose';
import { ITransaction } from '../IModels/ITransaction'

export const Transaction = new Schema<ITransaction>({
    amount: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now
    }
});
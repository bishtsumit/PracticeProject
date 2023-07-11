import { Schema, Types, model } from 'mongoose';
import { IWallet } from "../IModels/IWallet";
import { Transaction } from './transactions'

const schema = new Schema<IWallet>({
    name: { type: String, required: true },
    balance: { type: Number, required: true },
    date: {
        type: Date,
        Default: Date.now,
    },
    Transactions: [Transaction]
});

// here user is the name of the object with which you want to export the schema
// wallet is the name of collection in mongoDB
export const wallet = model<IWallet>("wallets", schema);
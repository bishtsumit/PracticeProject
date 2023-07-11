import { ITransaction } from "./ITransaction";

export interface IWallet {
    balance: number;
    name: string;
    date?: Date
    Transactions?: [ITransaction]
}
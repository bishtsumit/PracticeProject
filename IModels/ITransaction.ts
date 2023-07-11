export interface ITransaction {
    amount: number,
    balance: number;
    type: string;
    description?: string;
    date: Date
    _id?: string
}
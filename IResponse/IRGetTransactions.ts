export interface IRGetTransactions {
    id: string;
    walletId?: string;
    amount: number;
    balance: number;
    description?: string;
    date: Date;
    type: string;
}
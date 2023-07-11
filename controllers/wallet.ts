import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { wallet } from '../models/wallet'
import { ITransaction } from '../IModels/ITransaction';
import { IRWalletResponse } from '../IResponse/IRWalletResponse'
import { validatSetupWalletInput } from '../validation/setupWallet';
import { IWallet } from '../IModels/IWallet';
import { validatetransaction } from '../validation/transaction';
import { IRCreateTransactionResponse } from '../IResponse/IRCreateTransactionResponse';
import { validateGetTransactions } from '../validation/getTransactions';
import { IRGetTransactions } from '../IResponse/IRGetTransactions';
import { validateGetWalletDetails } from '../validation/getWalletDetail';
import mongoose from 'mongoose';


const setupWallet = async (req: Request, res: Response) => {
    try {

        const { errors, isValid } = validatSetupWalletInput(req.body);
        const walletObj: IWallet = req.body;
        if (!isValid) {
            return res.status(500).json(errors);
        }

        const resWallet = await wallet.findOne({ name: walletObj.name });

        if (resWallet) {
            return res.status(500).json({
                message: `Wallet with name <${walletObj.name}>  is already defined`
            });
        }

        const walletItem = new wallet({
            balance: parseFloat(Number(walletObj.balance).toFixed(4)),
            name: walletObj.name,
            date: new Date()
        });

        console.log(walletItem);

        const ret = await walletItem.save();
        const resData: IRWalletResponse = {
            balance: ret.balance,
            name: ret.name,
            id: ret._id.toString(),
            date: ret.date
        };

        console.log(resData);

        return res.status(200).json(resData);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "error while creating wallet"
        });
    }
};


const createTransaction = async (req: Request, res: Response) => {
    // get some posts
    try {

        const { errors, isValid } = validatetransaction(req.body, req.params.walletId);
        if (!isValid) {
            return res.status(500).json(errors);
        }

        const resWallet = await wallet.findOne({ _id: req.params.walletId });

        if (!resWallet) {
            return res.status(404).json({
                message: "Wallet Id cannot be found"
            });
        }


        const newBalance: number = resWallet.balance + Number(req.body.amount);
        if (newBalance < 0) {
            return res.status(500).json({
                message: "Cannot Process this Transaction as balance will be less than 0"
            });
        }

        const Transaction: ITransaction = {
            amount: parseFloat(Number(Math.abs(req.body.amount)).toFixed(4)),
            balance: parseFloat(Number(newBalance).toFixed(4)),
            type: req.body.amount >= 0 ? "CREDIT" : "DEBIT",
            description: req.body.description,
            date: new Date()
        }

        const resUpdate = await wallet.findByIdAndUpdate(
            { _id: req.params.walletId },
            {
                $push: {
                    Transactions: Transaction,
                },
                $set: { balance: Transaction.balance },
            },
            { new: true }
        )

        const walletDoc: IWallet | null = resUpdate;
        const TransactArr: [ITransaction] | undefined = walletDoc?.Transactions;
        const RecentTransactionId = TransactArr ? TransactArr[TransactArr.length - 1]._id?.toString() : ""
        const responseObj: IRCreateTransactionResponse = {
            balance: walletDoc?.balance,
            transactionId: RecentTransactionId ? RecentTransactionId : ""
        }

        return res.status(200).json(responseObj);

    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "error while processing transaction"
        });
    }
};

const getTransactions = async (req: Request, res: Response) => {
    try {

        const { errors, isValid } = validateGetTransactions(req.query);

        if (!isValid) {
            return res.status(500).json(errors);
        }

        //const resWallet = await wallet.findOne({ _id: req.query.walletId }, { Transactions: { $slice: [Number(req.query.skip), Number(req.query.limit)] } });
        const walletId: string = req.query.walletId ? req.query.walletId.toString() : "";
        const sortKey = 'Transactions.' + (req.query.sort ? req.query.sort.toString() : "date"); // default date sorting
        const direction = req.query.direction ? req.query.direction : 'ASC';
        let resWallet = [];

        if (Number(req.query.limit) != -1) {
            resWallet = await wallet.aggregate([
                { "$match": { "_id": new mongoose.Types.ObjectId(walletId) } },
                {
                    $sort: { sortKey: direction == "ASC" ? 1 : -1 }
                },
                {
                    "$project": {
                        "_id": 1,
                        "Transactions": { "$slice": ["$Transactions", Number(req.query.skip), Number(req.query.limit)] }
                    }
                }
            ])
        }
        else {
            resWallet = await wallet.aggregate([
                { "$match": { "_id": new mongoose.Types.ObjectId(walletId) } },
            ])
        }

        const resTotalCount = await wallet.aggregate([{ "$match": { _id: new mongoose.Types.ObjectId(walletId) } }, { "$project": { "TotalCount": { "$size": "$Transactions" } } }]);

        let TransactionsListResponse: IRGetTransactions[] = [];

        let TransactionArr: ITransaction[] | undefined = resWallet[0]?.Transactions;

        if (!TransactionArr)
            TransactionArr = [];

        for (let item of TransactionArr) {
            const Transaction: IRGetTransactions = {
                id: item._id ? item._id.toString() : "",
                walletId: resWallet[0]?._id ? resWallet[0]?._id.toString() : "",
                amount: item.amount,
                balance: item.balance,
                description: item?.description,
                date: new Date(item.date),
                type: item.type
            }

            TransactionsListResponse.push(Transaction);
        }

        return res.status(200).json({ Transactions: TransactionsListResponse, count: resTotalCount[0]?.TotalCount });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "error while fetching transactions"
        });
    }
};

const getWalletDetail = async (req: Request, res: Response) => {
    try {

        const { errors, isValid } = validateGetWalletDetails(req.params);

        if (!isValid) {
            return res.status(500).json(errors);
        }

        const walletDtl = await wallet.findOne({ _id: req.params.id });

        const WalletResponse: IRWalletResponse = {
            id: walletDtl?._id ? walletDtl?.id : "",
            balance: walletDtl?.balance ? walletDtl.balance : 0,
            name: walletDtl?.name ? walletDtl.name : "",
            date: walletDtl?.date
        }
        return res.status(200).json(WalletResponse);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "error while fetching transactions"
        });
    }
};

export default { setupWallet, createTransaction, getTransactions, getWalletDetail };
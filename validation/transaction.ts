import { ITransaction } from "../IModels/ITransaction";

const Validator = require("validator");
const isEmpty = require("./is-empty");

export function validatetransaction(data: ITransaction, walletId: string | undefined) {
    let errors: any = {};

    if (Validator.isEmpty(data.amount)) {
        errors.message = "balance field is required";
    }

    if (!Validator.isNumeric(data.amount)) {
        errors.message = "Enter valid balance";
    }

    if (Validator.isEmpty(walletId)) {
        errors.message = "wallet Id is required";
    }

    if (!Validator.isAlphanumeric(walletId)) {
        errors.message = "pass valid wallet Id";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
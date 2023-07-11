import { ITransaction } from "../IModels/ITransaction";

const Validator = require("validator");
const isEmpty = require("./is-empty");

export function validateGetTransactions(queryParams: any) {
    let errors: any = {};

    if (Validator.isEmpty(queryParams.walletId)) {
        errors.message = "Wallet Id is required";
    }

    if (!Validator.isNumeric(queryParams.skip)) {
        errors.message = "Skip Count is required";
    }

    if (Validator.isEmpty(queryParams.limit)) {
        errors.message = "limit count is required";
    }

    if (!Validator.isAlphanumeric(queryParams.walletId)) {
        errors.message = "pass valid wallet Id";
    }

    if (!Validator.isNumeric(queryParams.skip)) {
        errors.balance = "pass valid skip count";
    }

    if (!Validator.isNumeric(queryParams.limit)) {
        errors.balance = "pass valid limit value";
    }

    if (queryParams.limit == 0 || queryParams.limit < -1) {
        errors.message = "pass valid limit value";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
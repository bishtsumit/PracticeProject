import { IWallet } from "../IModels/IWallet";

const Validator = require("validator");
const isEmpty = require("./is-empty");

export function validatSetupWalletInput(data: IWallet) {
    let errors: any = {};

    if (Validator.isEmpty(data.name)) {
        errors.message = "Name field is required";
    }

    if (Validator.isEmpty(data.balance)) {
        errors.message = "balance field is required";
    }

    if (!Validator.isNumeric(data.balance)) {
        errors.message = "Enter valid balance";
    }

    if (data.balance < 0) {
        errors.message = "Balance should be greater than zero";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
const Validator = require("validator");
const isEmpty = require("./is-empty");

export function validateGetWalletDetails(params: any) {
    let errors: any = {};

    if (Validator.isEmpty(params.id)) {
        errors.message = "wallet is required";
    }

    if (!Validator.isAlphanumeric(params.id)) {
        errors.message = "pass valid wallet Id";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
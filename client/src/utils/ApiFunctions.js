import Client from "./ApiClient";

const addWalletApi = async (payload) => {
    return new Promise((resolve, reject) => {
        Client.post("wallet", payload) 
            .then((resData) => {

                resolve(resData);
            })
            .catch((error) => {
                reject(error);
            });
    })
}

const addTransactionApi = async (payload, param) => {
    return new Promise((resolve, reject) => {
        Client.post("transact/" + param, payload) 
            .then((resData) => {

                resolve(resData);
            })
            .catch((error) => {
                reject(error);
            });
    })
}

const getTransactionsApi = async (payload) => {
    return new Promise((resolve, reject) => {
        Client.get("transactions", payload) 
            .then((resData) => {

                resolve(resData);
            })
            .catch((error) => {
                reject(error);
            });
    })
}


export {
    addWalletApi,
    addTransactionApi,
    getTransactionsApi
}
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "../App.css";
import { addWalletApi, addTransactionApi } from "../utils/ApiFunctions";
import BeatLoader from "react-spinners/BeatLoader";
import { Outlet, Link } from "react-router-dom";

export default function AddWallet(props) {
    const initialWallet = { name: "", balance: 10, id: '' };
    const [wallet, setWallet] = useState(initialWallet);
    const [Spinner, SetSpinner] = useState(false);
    const [showAlert, SetAlert] = useState({ show: false, isDataSaved: false, message: "" });

    const [transaction, setTransaction] = useState({ amount: "", description: "", type: "CREDIT" });
    const [showTransactionAlert, SetTransactionAlert] = useState({ show: false, isDataSaved: false, message: "" });
    const [transactionSpinner, SetTransactionSpinner] = useState(false);

    useEffect(() => {
        let savedWallet = localStorage.getItem("wallet");
        if (savedWallet) {
            setWallet(JSON.parse(savedWallet));
        }
    }, []);


    const onChange = (e) => {
        setWallet({ name: e.target.value, balance: wallet.balance });
    }

    const onChangeTransaction = (e) => {
        let obj = { ...transaction };
        obj[e.target.name] = e.target.value;
        console.log(obj);
        setTransaction(obj);
    }

    const addWallet = async (e) => {
        e.preventDefault();
        SetSpinner(true);
        try {
            if (!wallet.name) {
                SetAlert({ show: true, isDataSaved: false, message: "Enter Wallet Name" });
            }
            else {
                let data = await addWalletApi(wallet);
                localStorage.setItem("wallet", JSON.stringify(data));
                SetAlert({ show: true, isDataSaved: true, message: "Wallet Created Successfully" });
            }
        }
        catch (err) {
            SetAlert({ show: true, isDataSaved: false, message: err.Message });
        }
        finally {
            setTimeout(function () {
                SetInitialWalletState();
            }, 2000)
        }
    }

    const saveTransaction = async (e) => {
        e.preventDefault();
        SetTransactionSpinner(true);
        try {
            if (!transaction.amount || !transaction.type) {
                SetTransactionAlert({ show: true, isDataSaved: false, message: "Enter all details" });
            }
            else {

                if (transaction.type == "DEBIT") {
                    transaction.amount = -1 * transaction.amount;
                }

                console.log(transaction);
                let data = await addTransactionApi(transaction, wallet.id);
                console.log(data);

                SetTransactionAlert({ show: true, isDataSaved: true, message: "transaction done successfully" });
                let obj = { ...wallet };
                obj["balance"] = data.balance;
                localStorage.setItem("wallet", JSON.stringify(obj));
                setWallet(obj);

            }
        }
        catch (err) {
            SetTransactionAlert({ show: true, isDataSaved: false, message: err.Message });
        }
        finally {
            setTimeout(function () {
                SetInitialTransactionState();
            }, 2000)
        }
    }

    function SetInitialWalletState() {
        let savedWallet = localStorage.getItem("wallet");
        if (savedWallet) {
            setWallet(JSON.parse(savedWallet));
        }
        else {
            setWallet({ name: "", balance: 10, id: '' });
        }

        SetSpinner(false);
        SetAlert({ show: false, isDataSaved: false });
    }

    function SetInitialTransactionState() {
        setTransaction({ amount: "", description: "", type: "CREDIT" });
        SetTransactionSpinner(false);
        SetTransactionAlert({ show: false, isDataSaved: false, message: "" });
    }

    return (
        <>
            <form>
                <div className="DashboardBody" style={{ marginBottom: "35px" }}>
                    <div>
                        <h1 className="RequireDetlHead"> Add New Wallet </h1>
                    </div>
                </div>
                <div className="clr"></div>
                <div style={{ float: "left", width: "90%", marginLeft: "5%" }}>
                    <div className="row">
                        <div className="col-md-2">
                            <label name="lblWalletName">
                                Wallet Name
                            </label>
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                placeholder="Enter Name"
                                name="walletName"
                                value={wallet.name}
                                onChange={onChange}
                                disabled={wallet.id ? true : false}
                            />
                        </div>
                        <div style={{ display: wallet.id ? "block" : "none" }}>
                            <Link to="/transactions">Click here to check Transaction List</Link>
                        </div>
                    </div>

                    <div style={{ clear: "both" }}> </div>
                    <br />
                    <div className="row">
                        <div className="col-md-2">
                            <label name="lblBalance">
                                Balance
                            </label>
                        </div>
                        <div className="col-md-2">
                            <input
                                type="text"
                                placeholder="Name"
                                name="walletBalance"
                                value={wallet.balance}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div style={{ clear: "both" }}> </div>
                    <br />
                    <div className="row">
                        <div className="col-md-3">
                            <button type="button" className="btn btn-primary float-left" onClick={addWallet} disabled={wallet.id ? true : false}>Save Wallet</button>
                        </div>
                        <div className="col-md-3">
                            <div style={{ color: showAlert.isDataSaved ? "green" : "red", fontWeight: "bold", display: showAlert.show ? "block" : "none" }}> {showAlert.message}</div>
                        </div>
                    </div>
                    <div style={{ clear: "both" }}> </div>
                    <br />
                    <div className="row">
                        <BeatLoader
                            color={"#36d7b7"}
                            loading={Spinner}
                            size={20}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                </div>
                <br />
                <br />
                <br />
                <div style={{ paddingLeft: "50px", float: "left", display: wallet.id ? "block" : "none", width: "90%", border: "2px solid", marginLeft: "20px" }}>
                    <div className="DashboardBody" style={{ marginBottom: "35px" }}>
                        <div>
                            <h4 className="RequireDetlHead"> Add New transaction </h4>
                        </div>
                    </div>
                    <div style={{ clear: "both" }}> </div>
                    <br />
                    <br />
                    <div className="row">
                        <div className="col-md-2">
                            <label name="lblamount">
                                amount
                            </label>
                        </div>
                        <div className="col-md-2">
                            <input
                                type="text"
                                placeholder="Enter amount"
                                name="amount"
                                value={transaction.amount}
                                onChange={onChangeTransaction}
                            />
                        </div>
                    </div>
                    <div style={{ clear: "both" }}> </div>
                    <br />
                    <div className="row">
                        <div className="col-md-2 form-check form-check-inline" style={{ marginLeft: "15px" }}>
                            <label htmlFor="typeCredit" name="lblType" className="form-check-label">
                                CREDIT
                            </label>
                            <input type="radio"
                                value="CREDIT"
                                name="type"
                                id="typeCredit"
                                onChange={onChangeTransaction}
                                checked={transaction.type == "CREDIT" ? true : false}
                                className="form-check-input"
                            />
                        </div>
                        <div className="col-md-2 form-check form-check-inline">
                            <label htmlFor="typeDebit" name="lblType" className="form-check-label">
                                DEBIT
                            </label>
                            <input type="radio"
                                value="DEBIT"
                                name="type"
                                id="typeDebit"
                                onChange={onChangeTransaction}
                                checked={transaction.type == "DEBIT" ? true : false}
                                className="form-check-input"
                            />
                        </div>
                    </div>
                    <div style={{ clear: "both" }}> </div>
                    <br />
                    <div className="row">
                        <div className="col-md-2">
                            <label name="lbldescription">
                                description
                            </label>
                        </div>
                        <div className="col-md-2">
                            <input
                                type="text"
                                placeholder="Enter description"
                                name="description"
                                value={transaction.description}
                                onChange={onChangeTransaction}
                            />
                        </div>
                    </div>
                    <div style={{ clear: "both" }}> </div>
                    <br />
                    <div className="row">
                        <div className="col-md-3">
                            <button type="button" className="btn btn-primary float-left" onClick={saveTransaction} >Save Transaction</button>
                        </div>
                        <div className="col-md-3">
                            <div style={{ color: showTransactionAlert.isDataSaved ? "green" : "red", fontWeight: "bold", display: showTransactionAlert.show ? "block" : "none" }}> {showTransactionAlert.message}</div>
                        </div>
                    </div>
                    <div style={{ clear: "both" }}> </div>
                    <br />
                    <div className="row">
                        <BeatLoader
                            color={"#36d7b7"}
                            loading={transactionSpinner}
                            size={20}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                </div>

            </form >
        </>
    )
}
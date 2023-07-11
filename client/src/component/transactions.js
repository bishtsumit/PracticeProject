import React, { useState, useCallback } from "react";
import TablePagination from "./TablePagination";
import { getTransactionsApi } from "../utils/ApiFunctions";
import FileExcelIcon from 'mdi-react/FileExcelIcon';

const columns = [
    {
        Header: "date",
        accessor: "date",
        shouldSort: true
    },
    {
        Header: "amount",
        accessor: "amount",
        shouldSort: true
    },
    {
        Header: "Transaction Type",
        accessor: "type",
        shouldSort: false
    },
    {
        Header: "balance",
        accessor: "balance",
        shouldSort: false
    },
    {
        Header: "description",
        accessor: "description",
        shouldSort: false
    }
];


function GetTransactions(...props) {
    const [data, setData] = useState({ Transactions: [], totalTableCount: 0 });
    const [csvData, setcsvdata] = useState({ Data: [], loading: false });
    const [loading, setLoading] = useState(false);
    const [csvloading, setcsvLoading] = useState(false);

    const fetchData = useCallback(async ({ limit, skip, sort, direction }) => {
        setLoading(true);
        console.log("limit", limit, "skip", skip);
        try {
            const result = await getTransactionsApi({ limit, skip, walletId: JSON.parse(localStorage.getItem("wallet")).id, sort, direction });
            console.log("API called");
            setData(result);
        }
        catch (err) {
            console.log(err);
        }
        // page count, total of items.
        setLoading(false);
    }, []);

    const fetchcsvData = async () => {
        try {
            setcsvLoading(true);
            const result = await getTransactionsApi({ limit: -1, skip: 0, walletId: JSON.parse(localStorage.getItem("wallet")).id });


            let csv = createCsv(result.Transactions);

            var hiddenElement = document.createElement('a');
            hiddenElement.id = 'download-csv'
            hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
            hiddenElement.target = '_blank';
            //provide the name for the CSV file to be downloaded  
            hiddenElement.download = 'Transactions.csv';
            hiddenElement.click();
            document.getElementById('download-csv').remove();
            setcsvLoading(false);
        }
        catch (err) {
            setcsvLoading(false);
        }
    }

    const createCsv = (items) => {
        let csv = "";
        for (let row = 0; row < items.length; row++) {
            let keysAmount = Object.keys(items[row]).length
            let keysCounter = 0

            // If this is the first row, generate the headings
            if (row === 0) {

                // Loop each property of the object
                for (let key in items[row]) {
                    // This is to not add a comma at the last cell
                    // The '\r\n' adds a new line
                    csv += key + (keysCounter + 1 < keysAmount ? ',' : '\r\n')
                    keysCounter++
                }
            } else {
                for (let key in items[row]) {
                    csv += items[row][key] + (keysCounter + 1 < keysAmount ? ',' : '\r\n')
                    keysCounter++
                }
            }

            keysCounter = 0
        }
        return csv;
    }

    return (
        <div className="App">
            <h1 style={{ width: "50%", margin: "auto" }}>Transaction List</h1>

            <FileExcelIcon size={32} style={{ cursor: "pointer" }} onClick={fetchcsvData} />
            {csvloading && <div className="loading">Downloading CSV...</div>}
            <TablePagination
                data={data.Transactions}
                columns={columns}
                fetchData={fetchData}
                loading={loading}
                totalTableCount={data.count}
            />
        </div>
    );
}

export default GetTransactions;

import React, { useEffect } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import SortIcon from 'mdi-react/SortIcon'
import SortAscendingIcon from 'mdi-react/SortAscendingIcon'
import SortDescendingIcon from 'mdi-react/SortDescendingIcon'

const initialState = {
    queryPageIndex: 0,
    queryPageSize: 5,
    totalCount: 8,
    queryPageSortBy: []
};

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';
const PAGE_SORT_CHANGED = 'PAGE_SORT_CHANGED';

const reducer = (state, { type, payload }) => {
    switch (type) {
        case PAGE_CHANGED:
            return {
                ...state,
                queryPageIndex: payload,
            };
        case PAGE_SIZE_CHANGED:
            return {
                ...state,
                queryPageSize: payload,
            };
        case TOTAL_COUNT_CHANGED:
            return {
                ...state,
                totalCount: payload,
            };
        case PAGE_SORT_CHANGED:
            return {
                ...state,
                queryPageSortBy: payload,
            };
        default:
            throw new Error(`Unhandled action type: ${type}`);
    }
};


const Sorting = ({ column }) => (
    <span className="react-table__column-header sortable">
        {column.isSortedDesc === undefined ? (
            <SortIcon />
        ) : (
            <span>
                {column.isSortedDesc
                    ? <SortAscendingIcon />
                    : <SortDescendingIcon />}
            </span>
        )}
    </span>
);

function TablePagination({
    columns,
    data,
    fetchData,
    loading,
    totalTableCount
}) {

    console.log("called");
    //initialState.totalCount = totalTableCount;
    const [{ queryPageIndex, queryPageSize, totalCount, queryPageSortBy }, dispatch] =
        React.useReducer(reducer, initialState);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
        state: { pageSize, pageIndex, sortBy },
        gotoPage,
        pageCount,
        setPageSize,
        pageOptions
    } = useTable(
        {
            columns,
            data,
            initialState: { pageSize: queryPageSize, pageIndex: queryPageIndex, sortBy: queryPageSortBy },
            manualPagination: true,
            pageCount: Math.ceil(totalCount / queryPageSize),
        },
        useSortBy,
        usePagination
    );

    useEffect(() => {
        console.log("pageIndex", pageIndex, "limit", pageSize, "sortBy", sortBy);
        let sort = "", direction = "";
        if (sortBy.length > 0) {
            sort = sortBy[0].id;
            direction = sortBy[0].desc === false ? 'ASC' : 'DESC';
        }
        fetchData({ limit: pageSize, skip: pageIndex * pageSize, sort, direction });
    }, [fetchData, pageIndex, pageSize, sortBy]);

    useEffect(() => {
        dispatch({ type: PAGE_CHANGED, payload: pageIndex });
    }, [pageIndex]);

    useEffect(() => {
        if (totalTableCount) {
            dispatch({
                type: TOTAL_COUNT_CHANGED,
                payload: totalTableCount,
            });
        }
    }, [totalTableCount]);

    useEffect(() => {
        dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
        gotoPage(0);
    }, [pageSize, gotoPage]);


    useEffect(() => {
        dispatch({ type: PAGE_SORT_CHANGED, payload: sortBy });
        gotoPage(0);
    }, [sortBy, gotoPage]);

    const customPrevManage = () => {
        dispatch({ type: PAGE_CHANGED, payload: pageIndex });
        previousPage();
    };

    const customNextManage = () => {
        dispatch({ type: PAGE_CHANGED, payload: pageIndex });
        nextPage();
    };

    return (
        <>
            <div>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>{' '}
                <button
                    onClick={() => {
                        previousPage();
                    }}
                    disabled={!canPreviousPage}
                >
                    {"<"}
                </button>
                <button
                    onClick={() => {
                        nextPage();
                    }}
                    disabled={!canNextPage}
                >
                    {">"}
                </button>
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                >
                    {'>>'}
                </button>{' '}
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    <input
                        type="number"
                        value={pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(page);
                        }}
                        style={{ width: '100px' }}
                    />
                </span>{' '}
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[5, 10, 20, 30, 40].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                <br />
                {loading && <div className="loading">Loading...</div>}
            </div>
            <table {...getTableProps()} className="table table-striped table-bordered table-hover" style={{
                width: "90%", marginLeft: "5%"
            }}>
                <thead className="thead-dark">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Header")}
                                    {column.shouldSort ? <Sorting column={column} /> : ''}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}
export default TablePagination;

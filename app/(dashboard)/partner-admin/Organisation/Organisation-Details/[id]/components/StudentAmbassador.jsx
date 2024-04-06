import React, { useState, useMemo, useEffect, useCallback } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Tooltip from "@/components/ui/Tooltip";
import GlobalFilter from "@/components/partials/table/GlobalFilter";
import Edit from "./Edit";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from 'react-table';

const StudentAmbassador = ({ openForm, userData }) => {
  const COLUMNS = [
    {
      Header: 'S.No.',
      accessor: 'id',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: 'Name',
      accessor: 'name',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: 'Email ID',
      accessor: 'email',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: 'Mobile No.',
      accessor: 'mobile',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: (row) => {
        return (
          <span className="block w-full">
            <span
              className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                row?.cell?.value
                  ? 'text-success-500 bg-success-500'
                  : 'text-danger-500 bg-danger-500'
              }`}
            >
              {row?.cell?.value ? 'Active' : 'Inactive'}
            </span>
          </span>
        );
      },
    },
    {
      Header: 'Details',
      accessor: 'action',
      Cell: (row) => {
        return (
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Tooltip
              content="Edit"
              placement="top"
              arrow
              animation="shift-away"
            >
              <button
                className="action-btn"
                type="button"
                id={row?.row?.id}
                onClick={(i) => openUserModal(i)}
              >
                <Icon
                  icon="heroicons:pencil-square"
                  className="pointer-events-none"
                />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const columns = useMemo(() => COLUMNS, []);

  const data = useMemo(
    () =>
      userData?.studentAmbassador?.map((obj, index) => ({
        ...obj,
        id: index + 1,
      })),
    [userData]
  );

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editId, SetEditId] = useState();

  const tableInstance = useTable(
    {
      columns,
      data,
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const openUserModal = (i) => {
    const ClickedButtonIndex = i.target.id;
    SetEditId([ClickedButtonIndex, data[ClickedButtonIndex]?.id]);
    setIsUserModalOpen(true);
  };

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <Card className="bg-white">
      <div className="md:flex justify-between items-center mb-6">
        <div>
          <h4 className="card-title">Student Ambassador List</h4>
        </div>
        <div className="md:flex justify-between gap-6">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <Button
            text={'Create More'}
            className="btn btn-dark text-white h-10 py-2"
            onClick={() => {
              openForm();
            }}
          />
        </div>
      </div>
      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table
              className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
              {...getTableProps}
            >
              <thead className="bg-slate-200 dark:bg-slate-700">
                {headerGroups.map((headerGroup, index) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        scope="col"
                        className=" table-th"
                      >
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <Edit
                isUserModalOpen={isUserModalOpen}
                setIsUserModalOpen={setIsUserModalOpen}
                studentData={editId ? data[editId[0]] : null}
                id={userData?._id}
              />

              <tbody
                className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                {...getTableBodyProps}
              >
                {page.map((row) => {
                  prepareRow(row);
                  const { key, ...restRowProps } = row.getRowProps();
                  return (
                    <tr key={key} {...restRowProps}>
                      {row.cells.map((cell) => {
                        const { key, ...restCellProps } = cell.getCellProps();
                        return (
                          <td key={key} {...restCellProps} className="table-td">
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
        <div className=" flex items-center space-x-3 rtl:space-x-reverse">
          <select
            className="form-control py-2 w-max"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Page{' '}
            <span>
              {pageIndex + 1} of {pageOptions.length}
            </span>
          </span>
        </div>
        <ul className="flex items-center  space-x-3  rtl:space-x-reverse flex-wrap">
          <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              className={` ${
                !canPreviousPage ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              <Icon icon="heroicons:chevron-double-left-solid" />
            </button>
          </li>
          <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              className={` ${
                !canPreviousPage ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              Prev
            </button>
          </li>
          {pageOptions.map((page, pageIdx) => (
            <li key={pageIdx}>
              <button
                href="#"
                aria-current="page"
                className={` ${
                  pageIdx === pageIndex
                    ? 'bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium '
                    : 'bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  '
                }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                onClick={() => gotoPage(pageIdx)}
              >
                {page + 1}
              </button>
            </li>
          ))}
          <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              className={` ${
                !canNextPage ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              Next
            </button>
          </li>
          <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className={` ${
                !canNextPage ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Icon icon="heroicons:chevron-double-right-solid" />
            </button>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default StudentAmbassador;

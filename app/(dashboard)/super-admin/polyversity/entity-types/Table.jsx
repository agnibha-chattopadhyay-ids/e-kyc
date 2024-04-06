// /* eslint-disable react/display-name */
// import React, { useState, useMemo } from "react";
// import Button from "@/components/ui/Button";
// import Card from "@/components/ui/Card";
// import Icon from "@/components/ui/Icon";
// import Tooltip from "@/components/ui/Tooltip";
// import GlobalFilter from "@/components/partials/table/GlobalFilter";

// import {
//   useTable,
//   useRowSelect,
//   useSortBy,
//   useGlobalFilter,
//   usePagination,
// } from "react-table";

// import EditForm from "./Edit";

// const IndeterminateCheckbox = React.forwardRef(
//   ({ indeterminate, ...rest }, ref) => {
//     const defaultRef = React.useRef();
//     const resolvedRef = ref || defaultRef;

//     React.useEffect(() => {
//       resolvedRef.current.indeterminate = indeterminate;
//     }, [resolvedRef, indeterminate]);

//     return (
//       <>
//         <input
//           type="checkbox"
//           ref={resolvedRef}
//           {...rest}
//           className="table-checkbox"
//         />
//       </>
//     );
//   }
// );

// const Table = ({ title = "Entity Types", items, openForm }) => {
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [editId, SetEditId] = useState();
//   // console.log('items++++', items);

//   const openUserModal = (i) => {
//     const ClickedButtonIndex = i.target.id;
//     SetEditId([ClickedButtonIndex, data[ClickedButtonIndex]._id]);
//     setIsUserModalOpen(true);
//     // console.log("EditId:", ClickedButtonIndex);
//     // console.log("EditId:", data[ClickedButtonIndex]._id);
//   };

//   const COLUMNS = [
//     {
//       Header: "ID",
//       accessor: "id",
//       Cell: (row) => {
//         return <span>{row?.cell?.value}</span>;
//       },
//     },
//     {
//       Header: "Name",
//       accessor: "name",
//       Cell: (row) => {
//         return (
//           <div>
//             <span className="inline-flex items-center">
//               <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
//                 {row?.cell?.value}
//               </span>
//             </span>
//           </div>
//         );
//       },
//     },
//     {
//       Header: "Entity ID",
//       accessor: "entityId",
//       Cell: (row) => {
//         return (
//           <div>
//             <span className="inline-flex items-center">
//               <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
//                 {row?.cell?.value}
//               </span>
//             </span>
//           </div>
//         );
//       },
//     },
//     {
//       Header: "DESCRIPTION",
//       accessor: "description",
//       Cell: (row) => {
//         return <span>{row?.cell?.value}</span>;
//       },
//     },
//     {
//       Header: "STATUS",
//       accessor: "status",
//       Cell: (row) => {
//         return <span>{row?.cell?.value == 1 ? "Active" : "Inactive"}</span>;
//       },
//     },
//     {
//       Header: "ACTION",
//       accessor: "action",
//       Cell: (row) => {
//         return (
//           <div className="flex space-x-3 rtl:space-x-reverse">
//             <Tooltip
//               content="Edit"
//               placement="top"
//               arrow
//               animation="shift-away"
//             >
//               <button
//                 className="action-btn"
//                 type="button"
//                 id={row?.row?.id}
//                 onClick={(i) => openUserModal(i)}
//               >
//                 <Icon
//                   icon="heroicons:pencil-square"
//                   className="pointer-events-none"
//                 />
//               </button>
//             </Tooltip>
//           </div>
//         );
//       },
//     },
//   ];

//   const columns = useMemo(() => COLUMNS, []);
//   const data = useMemo(() => items, []);

//   // console.log("Data:", data);
//   const tableInstance = useTable(
//     {
//       columns,
//       data,
//     },

//     useGlobalFilter,
//     useSortBy,
//     usePagination,
//     useRowSelect,

//     (hooks) => {
//       hooks.visibleColumns.push((columns) => [...columns]);
//     }
//   );
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     footerGroups,
//     page,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//     pageOptions,
//     state,
//     gotoPage,
//     pageCount,
//     setPageSize,
//     setGlobalFilter,
//     prepareRow,
//   } = tableInstance;

//   const { globalFilter, pageIndex, pageSize } = state;

//   return (
//     <>
//       <Card>
//       <div className="md:flex justify-between items-center mb-6">
//           <div>
//             <h4 className="card-title">{title}</h4>
//           </div>
//           <div className="md:flex justify-between gap-6">
//             <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
//             <Button
//               text={"Add Entity"}
//               onClick={() => {
//                 openForm();
//               }}
//               className="btn btn-dark text-white h-10 py-2"
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto -mx-6">
//           <div className="inline-block min-w-full align-middle">
//             <div className="overflow-hidden">
//               <table
//                 className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
//                 {...getTableProps}
//               >
//                 <thead className="bg-[#EEF4F899] dark:bg-slate-700">
//                   {headerGroups.map((headerGroup) => (
//                     <tr {...headerGroup.getHeaderGroupProps()}>
//                       {headerGroup.headers.map((column) => (
//                         <th
//                           {...column.getHeaderProps()}
//                           scope="col"
//                           className=" table-th "
//                         >
//                           {column.render("Header")}
//                           <span>
//                             {column.isSorted
//                               ? column.isSortedDesc
//                                 ? " 🔽"
//                                 : " 🔼"
//                               : ""}
//                           </span>
//                         </th>
//                       ))}
//                     </tr>
//                   ))}
//                 </thead>
//                 <EditForm
//                   isUserModalOpen={isUserModalOpen}
//                   setIsUserModalOpen={setIsUserModalOpen}
//                   data={editId ? items[editId[0]] : ""}
//                 />
//                 <tbody
//                   className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
//                   {...getTableBodyProps}
//                 >
//                   {page.map((row) => {
//                     prepareRow(row);
//                     const { key, ...restRowProps } = row.getRowProps();
//                     return (
//                       <tr key={key} {...restRowProps}>
//                         {row.cells.map((cell) => {
//                           const { key, ...restCellProps } = cell.getCellProps();
//                           return (
//                             <td
//                               key={key}
//                               {...restCellProps}
//                               className="table-td"
//                             >
//                               {cell.render("Cell")}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
//           <div className=" flex items-center space-x-3 rtl:space-x-reverse">
//             <select
//               className="form-control py-2 w-max"
//               value={pageSize}
//               onChange={(e) => setPageSize(Number(e.target.value))}
//             >
//               {[10, 25, 50].map((pageSize) => (
//                 <option key={pageSize} value={pageSize}>
//                   Show {pageSize}
//                 </option>
//               ))}
//             </select>
//             <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
//               Page{" "}
//               <span>
//                 {pageIndex + 1} of {pageOptions.length}
//               </span>
//             </span>
//           </div>
//           <ul className="flex items-center  space-x-3  rtl:space-x-reverse flex-wrap">
//             <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
//               <button
//                 className={` ${
//                   !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//               >
//                 <Icon icon="heroicons:chevron-double-left-solid" />
//               </button>
//             </li>
//             <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
//               <button
//                 className={` ${
//                   !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 Prev
//               </button>
//             </li>
//             {pageOptions.map((page, pageIdx) => (
//               <li key={pageIdx}>
//                 <button
//                   href="#"
//                   aria-current="page"
//                   className={` ${
//                     pageIdx === pageIndex
//                       ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
//                       : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
//                   }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
//                   onClick={() => gotoPage(pageIdx)}
//                 >
//                   {page + 1}
//                 </button>
//               </li>
//             ))}
//             <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
//               <button
//                 className={` ${
//                   !canNextPage ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//               >
//                 Next
//               </button>
//             </li>
//             <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
//               <button
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//                 className={` ${
//                   !canNextPage ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 <Icon icon="heroicons:chevron-double-right-solid" />
//               </button>
//             </li>
//           </ul>
//         </div>
//       </Card>
//     </>
//   );
// };

// export default Table;
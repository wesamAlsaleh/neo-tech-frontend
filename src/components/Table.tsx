import React from "react";

// import custom components
import PaginationControl from "./PaginationControl";

interface TableProps {
  columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[]; // Array of objects representing the columns of the table
  rows: any[]; // Array of objects representing the rows of the table
  noDataMessage: string; // Message to display when there are no rows to show
  onRowClick?: (row: any) => void; // Function to handle row click events
  renderCell?: (row: any, columnKey: string) => React.ReactNode; // Function to render custom cell content
  currentPage?: number; // Current page number for pagination
  totalPages?: number; // Total number of pages for pagination
  setCurrentPage?: (page: number) => void; // Function to set the current page for pagination
  isLoading?: boolean; // Flag to indicate if the table is loading data
}

/**
 * A reusable and customizable table component for displaying tabular data.
 *
 * @component
 * @param {TableProps} props - The props for the Table component.
 * @param {Array<{ key: string; label: string; align?: string }>} props.columns -
 *   An array of column definitions. Each column should have a `key` (used for identifying the column),
 *   a `label` (displayed as the column header), and an optional `align` (text alignment: "left", "center", or "right").
 * @param {Array<Record<string, any>>} props.rows -
 *   An array of row data. Each row is an object where keys match the `key` values of the columns.
 * @param {string} props.noDataMessage -
 *   A message to display when there are no rows to show.
 * @param {(row: Record<string, any>) => void} [props.onRowClick] -
 *   An optional callback function triggered when a row is clicked. Receives the clicked row as an argument.
 * @param {(row: Record<string, any>, key: string) => React.ReactNode} [props.renderCell] -
 *   An optional function for custom rendering of cell content. Receives the row and column key as arguments.
 *
 * @returns {JSX.Element} The rendered table component.
 *
 * @example
 * ```tsx
 * const columns = [
 *   { key: 'name', label: 'Name', align: 'left' },
 *   { key: 'age', label: 'Age', align: 'center' },
 *   { key: 'email', label: 'Email', align: 'right' },
 * ];
 *
 * const rows = [
 *   { name: 'John Doe', age: 30, email: 'john.doe@example.com' },
 *   { name: 'Jane Smith', age: 25, email: 'jane.smith@example.com' },
 * ];
 *
 * <Table
 *   columns={columns}
 *   rows={rows}
 *   noDataMessage="No data available"
 *   onRowClick={(row) => console.log('Row clicked:', row)}
 *   renderCell={(row, key) => <span>{row[key]}</span>}
 * />
 * ```
 */
export default function Table({
  columns,
  rows,
  noDataMessage,
  onRowClick,
  renderCell,
  currentPage = 1,
  totalPages = 1,
  setCurrentPage = () => {},
  isLoading = false,
}: TableProps) {
  // Handle Loading State
  if (isLoading) {
    return (
      <div className="w-full h-full">
        {/* Table container with controlled dimensions */}
        <div className="w-full h-full relative overflow-hidden rounded-lg shadow-md">
          {/* Scrollable viewport */}
          <div className="w-full h-full overflow-auto">
            {/* Table */}
            <table className="w-full table-auto">
              <thead className="sticky top-0 z-10">
                <tr className="bg-orange-500 text-white uppercase text-sm leading-normal">
                  {columns.map((col, index) => {
                    // If align is not provided, default to left alignment
                    const alignClass = col.align
                      ? `text-${col.align}`
                      : "text-left";

                    return (
                      <th
                        key={col.key}
                        className={`py-3 px-6 ${alignClass} ${
                          index === 0 ? "rounded-tl-lg" : ""
                        } ${
                          index === columns.length - 1 ? "rounded-tr-lg" : ""
                        }`}
                      >
                        {col.label}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="text-gray-600">
                {/* Skeleton rows - repeat for the number of items you expect */}
                {[...Array(5)].map((_, rowIndex) => (
                  <tr
                    key={`skeleton-row-${rowIndex}`}
                    className="border-b border-gray-200"
                  >
                    {columns.map((col) => (
                      <td
                        key={`skeleton-${col.key}`}
                        className={`py-4 px-6 ${
                          col.align ? `text-${col.align}` : "text-left"
                        }`}
                      >
                        {/* Skeleton Layout */}
                        <div className="flex flex-col space-y-2">
                          {/* Animated placeholder bars with different widths */}
                          <div
                            className="h-4 bg-gray-200 rounded animate-pulse"
                            style={{
                              width: `${Math.random() * 30 + 70}%`,
                              animationDelay: `${rowIndex * 0.1}s`,
                            }}
                          />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Complete wrapper to ensure table fits within containing element
    <div className="w-full h-full">
      {/* Table container with controlled dimensions */}
      <div className="w-full h-full relative overflow-hidden rounded-lg shadow-md">
        {/* Scrollable viewport */}
        <div className="w-full h-full overflow-auto">
          {/* Table */}
          <table className="w-full table-auto">
            <thead className="sticky top-0 z-10">
              <tr className="bg-orange-500 text-white uppercase text-sm leading-normal">
                {columns.map((col, index) => {
                  // If align is not provided, default to left alignment
                  const alignClass = col.align
                    ? `text-${col.align}`
                    : "text-left";

                  return (
                    <th
                      key={col.key}
                      className={`py-3 px-6 ${alignClass} ${
                        index === 0 ? "rounded-tl-lg" : ""
                      } ${index === columns.length - 1 ? "rounded-tr-lg" : ""}`}
                    >
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="text-gray-600 ">
              {/* No data */}
              {(!rows || rows.length === 0) && (
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td
                    colSpan={columns.length}
                    className="py-3 px-6 text-center"
                  >
                    {noDataMessage}
                  </td>
                </tr>
              )}

              {/* Rows */}
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => {
                    // If align is not provided, default to left alignment
                    const alignClass = col.align
                      ? `text-${col.align}`
                      : "text-left";
                    return (
                      <td
                        key={col.key}
                        className={`py-3 px-6 text-${
                          col.align || "left"
                        } break-words`}
                      >
                        {renderCell ? renderCell(row, col.key) : row[col.key]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Control */}
      {currentPage && totalPages && setCurrentPage && (
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

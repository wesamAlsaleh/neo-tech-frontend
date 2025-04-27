import React from "react";

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
}: TableProps) {
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
    </div>
  );
}

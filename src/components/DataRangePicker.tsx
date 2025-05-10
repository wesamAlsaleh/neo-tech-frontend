'use client"';

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface DateRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  className?: string;
}

export default function DataRangePicker(props: DateRangePickerProps) {
  const { startDate, endDate, className } = props;

  // router instance to navigate to the sales report page
  const router = useRouter();

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Start Date */}
      <div>
        <label htmlFor="start-date" className="block text-sm font-medium">
          Start Date
        </label>

        <input
          id="start-date"
          type="date"
          value={startDate ?? ""}
          onChange={(e) => {
            router.push(
              `/admin/analytics?start_date=${e.target.value}&end_date=${endDate}`
            );
          }}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      {/* End Date */}
      <div>
        <label htmlFor="end-date" className="block text-sm font-medium">
          End Date
        </label>

        <input
          id="end-date"
          type="date"
          value={endDate ?? ""}
          onChange={(e) =>
            router.push(
              `/admin/analytics?start_date=${startDate}&end_date=${e.target.value}`
            )
          }
          className="border px-2 py-1 rounded w-full"
        />
      </div>
    </div>
  );
}

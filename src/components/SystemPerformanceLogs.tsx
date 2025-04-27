"use client";

import React, { useEffect, useState } from "react";

// import backend services
import { getSystemLogs } from "@/services/dashboard-services";

// import types
import { SystemLog } from "@/types/log";

// import custom components
import Table from "./Table";
import { formatDateTime } from "@/lib/helpers";

export default function SystemPerformanceLogs() {
  // State to manage system logs data
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "message", label: "Message", align: "left" },
    { key: "log_type", label: "Type", align: "center" },
    { key: "created_at", label: "Date", align: "center" },
  ]; // Define the columns for the table

  /**
   * UI States
   */
  const [loading, setLoading] = useState(false); // State to manage loading states
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  }); // State to store the server response

  const fetchData = async () => {
    // Call the backend service to fetch system performance logs
    const result = await getSystemLogs();

    // Update the UI
    setServerResponse({
      status: result.status,
      message: result.message,
    });

    // Set the system logs data
    setSystemLogs(result.logs);
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Fetch the data from the server
      await fetchData();

      // Set loading to false after fetching data
      setLoading(false);
    };

    initFetch();
  }, []);

  // UseEffect to automatically refresh the page every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(); // Fetch data every 15 seconds
    }, 15000); // 15 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <Table
      columns={columns}
      rows={systemLogs}
      noDataMessage="No Logs Available"
      // onRowClick={(row) => console.log("Row clicked:", row)}
      renderCell={(row, key) => {
        if (key === "log_type") {
          // Get the status code from the row object
          const statusCode = row["status_code"];

          // Define the default badge class
          let badgeClass = "bg-gray-100 text-gray-700 border border-gray-400"; // default

          if (row[key] === "debug") {
            // If the log type is "debug", set the badge class to purple
            badgeClass =
              "bg-purple-100 text-purple-700 border border-purple-400";
          } else if (row[key] === "warning") {
            // If the log type is "warning", set the badge class to yellow
            badgeClass =
              "bg-yellow-100 text-yellow-700 border border-yellow-400";
          } else if (statusCode >= 200 && statusCode < 300) {
            // If the status code is in the range of 200-299, set the badge class to green
            badgeClass = "bg-green-100 text-green-700 border border-green-400";
          } else if (statusCode >= 300 && statusCode < 400) {
            // If the status code is in the range of 300-399, set the badge class to yellow
            badgeClass =
              "bg-yellow-100 text-yellow-700 border border-yellow-400";
          } else if (statusCode >= 400 && statusCode < 500) {
            // If the status code is in the range of 400-499, set the badge class to red
            badgeClass = "bg-red-100 text-red-700 border border-red-400";
          }

          return (
            <span className={`px-3 py-1 rounded-full text-xs ${badgeClass}`}>
              <span className="capitalize">{row[key]}</span>
            </span>
          );
        }

        if (key === "created_at") {
          return <span className="text-xs">{formatDateTime(row[key])}</span>;
        }

        return <span>{row[key]}</span>;
      }}
    />
  );
}

"use client";

import React, { useEffect, useState } from "react";

// import backend services
import { getSystemLogs } from "@/services/dashboard-services";

// import types
import { SystemLog } from "@/types/log";

// import custom components
import Table from "./Table";

export default function SystemPerformanceLogs() {
  // State to manage system logs data
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const columns = [
    { key: "id", label: "ID" },
    { key: "message", label: "Message" },
    { key: "status_code", label: "Status Code" },
    { key: "created_at", label: "Created At" },
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
      onRowClick={(row) => console.log("Row clicked:", row)}
    />
  );
}

export type SystemLog = {
  id: number; // Unique identifier for the log entry
  log_type: string; // Type of log (e.g., "error", "info", "warning")
  message: string; // The actual log message
  context: string; // Context or additional information about the log entry
  user_id: number; // ID of the user associated with the log entry
  status_code: string; // Status code (e.g., "200", "404", "500")
  created_at: string; // Timestamp of when the log entry was created
  updated_at: string; // Timestamp of when the log entry was last updated
  user: {
    first_name: string; // First name of the user
    last_name: string; // Last name of the users
    email: string; // Email of the user
  };
};

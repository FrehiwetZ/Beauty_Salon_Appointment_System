/**
 * Server Entry Point
 * Starts the Express HTTP server and handles process-level errors.
 */

import app from './app';
import { env } from './config/env';

/** Port to listen on, defaults to 5000 */
const PORT = env.PORT || 5000;

/** Start the HTTP server */
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
 * Handle unhandled promise rejections globally.
 * Logs the error and gracefully shuts down the server.
 */
process.on('unhandledRejection', (err: Error) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

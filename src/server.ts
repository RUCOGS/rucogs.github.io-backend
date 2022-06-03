import { startServer } from "@src/misc/server-constructor";

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length > 0) {
  switch (args[0]) {
    case "development":
      startServer(true);
      break;
    case "production":
    default:
      startServer(false);
      break;
  }
} else {
  switch (process.env.NODE_ENV) {
    case "development":
      startServer(true);
      break;
    case "production":
    default:
      startServer(false);
      break;
  }
}
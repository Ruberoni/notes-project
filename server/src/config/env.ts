import { resolve } from "path";
import { config } from "dotenv";

let path = "../../.env";

if (process.env.NODE_ENV == "production") {
  path = "../../.env";
}

if (process.env.NODE_ENV == "development") {
  path = "../../.env";
}

config({ path: resolve(__dirname, path) });

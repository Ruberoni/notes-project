import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../../.env") });

/*
if (process.env.SAMPLE) {
  console.log("dotenv working properly");
  console.log(`process.env.SAMPLE = ${process.env.SAMPLE}`);
} else {
  console.log("dotenv not working properly");
}
*/

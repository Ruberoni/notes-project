import "reflect-metadata";
import "./config/env";
import { initServer } from "./config/server";
import { connectDB } from "./config/database";
/*
import schema from "./schema";
import resolvers from "./resolvers";
*/

initServer(/*schema, resolvers*/);
// const DBConnection = connectDB({});
connectDB({});
/*
process.on("exit", () => {
  DBConnection.end((err: any) => {
    if (err) throw err;
    console.log("Database disconnected"); // remove this on production
  });
});
*/

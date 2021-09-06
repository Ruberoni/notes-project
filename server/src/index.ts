import "reflect-metadata";
import "./config/env";
import { initServer, connectDB } from "./config";
// import {  } from "./config/database";
/*
import schema from "./schema";
import resolvers from "./resolvers";
*/
// let m: number |= undefined;
// console.log(typeof m);

connectDB();
initServer(/*schema, resolvers*/);
// const DBConnection = connectDB({});
/*
process.on("exit", () => {
  DBConnection.end((err: any) => {
    if (err) throw err;
    console.log("Database disconnected"); // remove this on production
  });
});
*/

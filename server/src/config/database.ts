import mysql, { ConnectionOptions, Connection } from "mysql2/promise";
import fs from "fs";
import path from "path";

export let connection: Connection | undefined = undefined;

// console.log(__dirname + "../../../../../cacert.pem")

console.log(path.resolve(__dirname + "../../../../../../cacert.pem"));

/**
 * DB connection
 * Connects to DB
 */
export async function connectDB(
  connectionOptions?: ConnectionOptions,
  ref?: any
): Promise<void> {
  if (process.env.DB_URL) {
    connection = await mysql.createConnection(process.env.DB_URL);
  } else {
    let _connectionOptions = {};

    if (process.env.NODE_ENV == "test") {
      _connectionOptions = {
        host: process.env.DB_TEST_HOST,
        user: process.env.DB_TEST_USER,
        password: process.env.DB_TEST_PASSWORD,
      };
    } else {
      _connectionOptions = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      };
    }

    // Configure SSL
    if (process.env.DB_CACERT) {
      _connectionOptions = {
        ..._connectionOptions,
        ssl: {
          cert: Buffer.from(process.env.DB_CACERT, "base64").toString("ascii"),
        },
      };
    }

    _connectionOptions = {
      ..._connectionOptions,
      database: process.env.DB_NAME,
      ...connectionOptions,
    };

    connection = await mysql.createConnection(_connectionOptions);
  }
  if (ref) {
    Object.assign(ref, connection);
  }
  if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") {
    console.log("Database connected");
  }

  // Removed when changing from mysql to mysql2
  /*await connection.connect((err) => {
    if (err) throw err;
    console.log("Database connected"); // Remove this on production
  });*/

  // the function argument 'err' is a MySQL error
  // Removed when changing from mysql to mysql2
  // look in https://github.com/DefinitelyTyped/DefinitelyTyped/blob/c21aabd3e4ecd714635251f9f7f64af07e8fba87/types/mysql/index.d.ts
  // connection.on("error", (err: any) => {
  //   console.error(err?.code);
  // });

  // return connection;
}

/**
 * Event handlers
 */
/* 
if (connection) {
  });
} else {
  console.log("Unable to process. Please connect to the DB first.");
}
*/

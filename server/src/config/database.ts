import mysql, { ConnectionOptions, Connection } from "mysql2/promise";

export let connection: Connection | undefined = undefined;

/**
 * DB connection
 * Connects to DB
 */
export async function connectDB(
  connectionOptions?: ConnectionOptions
): Promise<void> {
  connection = await mysql.createConnection({
    // use enviorment variables
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:
      process.env.NODE_ENV == "test"
        ? process.env.DB_NAME_TEST
        : process.env.DB_NAME,
    ...connectionOptions,
  });

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

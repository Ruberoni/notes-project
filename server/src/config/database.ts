import mysql, { ConnectionConfig, Connection } from "mysql";

let connection: Connection | undefined = undefined;

/**
 * DB connection
 * Connects to DB
 */
export function connectDB(config: ConnectionConfig): Connection {
  connection = mysql.createConnection({
    // use enviorment variables
    host: "localhost",
    user: "root",
    password: "ruben750",
    database: "notes_project",
    insecureAuth: true,
    ...config,
  });

  connection.connect((err) => {
    if (err) throw err;
    console.log("Database connected"); // Remove this on production
  });

  // the function argument 'err' is a MySQL error
  // look in https://github.com/DefinitelyTyped/DefinitelyTyped/blob/c21aabd3e4ecd714635251f9f7f64af07e8fba87/types/mysql/index.d.ts
  connection.on("error", (err: any) => {
    console.error(err?.code);
  });

  return connection;
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

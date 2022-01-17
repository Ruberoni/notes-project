import mysql, { ConnectionOptions, Connection } from "mysql2/promise";

export let connection: Connection | undefined = undefined;

/**
 * DB connection
 * Connects to DB
 */
export async function connectDB(connectionOptions?: ConnectionOptions): Promise<void> {
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
  if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") {
    console.log("Database connected");
  }
}

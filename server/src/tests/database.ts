// import { Connection } from "mysql2";
import { connectDB, connection } from "../config/database";
import { expect } from "chai";

describe("MySQL connection", () => {
  // let connection: Connection | undefined;
  const connectionConfig = {
    // use enviorment variables
    database: "notes_project_test",
  };

  before(async () => {
    // Establish connection
    // connection = connectDB(connectionConfig);
    await connectDB(connectionConfig);
    setTimeout(() => {}, 2000);
  });

  after(async () => {
    // End connection
    await connection?.end();
  });

  it("Connection database should be 'notes_project_test'", () => {
    expect(connection?.config.database).to.equal("notes_project_test");
  });
});

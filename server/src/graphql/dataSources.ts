import { ConnectionConfig } from "mysql";
import { DataSource } from "apollo-datasource";
import { connectDB } from "../config/database";

export class NotesProjectDataSource extends DataSource {
  constructor(connectionConfig: ConnectionConfig) {
    super();

    this.DB = connectDB(connectionConfig);
    this.DB.connect();
  }

  getUser(id: string): void {
    this.DB.query(
      "SELECT * FROM user WHERE id = ?",
      [id],
      function (error, results) {
        // Throw a custom error exteding ApolloError class, for easy identify a DB error
        // so with the formatError arg property of the apolloServer function I can format the response depending of
        // the error type
        if (error) throw error;
        console.log("The solution is: ", results[0].solution);
      }
    );
  }
}

import "reflect-metadata";
import { expect } from "chai";
import { ApolloServer } from "apollo-server-hapi";
// import {  } from "../../../../config";
import { connectDB, connection, InitApolloServer } from "../../../../config/";
import { NotesProjectDataSource } from "../../../../graphql";
import { MockNPDataSource } from "../../../../utils/";

const DSInstance = new NotesProjectDataSource();
/*
function StubNotesProjectDataSource(method: any): SinonStub {
  return Sinon.stub(DSInstance, method);
} */

let server: undefined | ApolloServer;
let mockDataSource: undefined | MockNPDataSource;
/**
 * Integration testing the query resolvers.
 * This has to be done with the database and without the database.
 *
 * **With the database:** The server connects to a tests database.
 * **Main test coverage:** Resolvers integration with the database & resolvers working with real data
 *
 * **Without the database:** Stub every method of the NotesProjectDataSource, so no db call is made.
 * **Main test coverage:** Resolvers data validation
 *
 * Extra info:
 * There are no tests without database.
 *
 * The test with database are incompleted
 */
export default function Tests(): void {
  before(async () => {
    // Need to connect db before starting apollo server, IDK why...
    await connectDB();
    server = await InitApolloServer(DSInstance);
  });

  after(async () => {
    await connection?.end();
  });

  describe("W/ database", () => {
    before(async () => {
      mockDataSource = new MockNPDataSource({ DB: connection });
      await mockDataSource.depopulateTable(1, 1, 1, 1);
    });

    after(async () => {
      await mockDataSource?.depopulateTable(1, 1, 1, 1);
    });

    beforeEach(async () => {
      await mockDataSource?.populateTable(1, 1, 1, 1);
    });

    afterEach(async () => {
      await mockDataSource?.depopulateTable(1, 1, 1, 1);
    });

    describe("getUser", () => {
      const GET_USER_QUERY =
        "query GetUser($id: String) { getUser(id: $id) { name } }";
      it("With good string id, res.data.getUser should return an user", async () => {
        // arrange
        const op = {
          query: GET_USER_QUERY,
          variables: {
            id: "1",
          },
        };
        //act
        const res = await server?.executeOperation(op);
        //assert
        expect(res?.errors).to.be.undefined;
        expect(res?.data?.getUser).to.be.an("object");
        expect(res?.data?.getUser.name).to.be.an("string");
      });
    });
    describe("getUserNotes", () => {
      const GET_USER_NOTES_QUERY =
        "query GetUserNotes($userId: String) { getUserNotes(userId: $userId) { title } }";
      it("With good userId, res.data.getUserNotes should return an array of notes", async () => {
        // arrange
        const op = {
          query: GET_USER_NOTES_QUERY,
          variables: {
            userId: "1",
          },
        };
        //act
        const res = await server?.executeOperation(op);
        //assert
        expect(res?.errors).to.be.undefined;
        expect(res?.data?.getUserNotes).to.be.an("array");
        expect(res?.data?.getUserNotes[0]).to.be.an("object");
        expect(res?.data?.getUserNotes[0].title).to.be.an("string");
      });
    });
  });
}

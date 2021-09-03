import "reflect-metadata";
import Sinon, { SinonStub } from "sinon";
import { expect } from "chai";
import { NotesProjectDataSource } from "../../../../graphql";
import { InitApolloServer } from "../../../../config";
import { ApolloServer } from "apollo-server-hapi";

const DSInstance = new NotesProjectDataSource();
function StubNotesProjectDataSource(method: any): SinonStub {
  return Sinon.stub(DSInstance, method);
}

export default function Tests(): void {
  let server: undefined | ApolloServer;
  before(async () => {
    server = await InitApolloServer(DSInstance);
  });
  describe("register", () => {
    const REGISTER_QUERY =
      "mutation Register($data: UserContent!) { register(userContent: $data) }";

    const stub: SinonStub = StubNotesProjectDataSource("register");
    beforeEach(() => {
      stub.resolves("OK");
    });
    afterEach(() => {
      stub.restore();
    });
    it("Calling with good user data, res.data.register should return OK", async () => {
      // Arrange
      const op = {
        query: REGISTER_QUERY,
        variables: {
          data: {
            email: "johndoe@gmail.com",
          },
        },
      };

      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors).to.be.undefined;
      expect(res?.data).to.be.an("object");
      expect(res?.data?.register).to.be.an("string");
    });
    it("Calling with bad user data, error code should be 'INTERNAL_SERVER_ERROR'", async () => {
      // Arrange
      const op = {
        query: REGISTER_QUERY,
        variables: {
          data: {
            email: "Not an email",
          },
        },
      };
      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors?.[0].extensions?.code).to.equal(
        "INTERNAL_SERVER_ERROR"
      );
    });
  });
  describe("deleteUser", () => {
    const DELETE_QUERY =
      "mutation DeleteUser($id: String!) { deleteUser(id: $id) }";

    const stub: SinonStub = StubNotesProjectDataSource("deleteUser");
    beforeEach(() => {
      stub.resolves("OK");
    });
    afterEach(() => {
      stub.restore();
    });
    it("Calling with good id, res.data.deleteUser should return OK", async () => {
      // Arrange
      const op = {
        query: DELETE_QUERY,
        variables: {
          id: "1",
        },
      };

      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors).to.be.undefined;
      expect(res?.data).to.be.an("object");
      expect(res?.data?.deleteUser).to.be.an("string");
    });
    it("Calling with bad id, error code should be 'BAD_USER_INPUT'", async () => {
      // Arrange
      const op = {
        query: DELETE_QUERY,
        variables: {
          id: true,
        },
      };
      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors?.[0].extensions?.code).to.equal("BAD_USER_INPUT");
    });
  });
  describe("createNote", () => {
    const CREATE_NOTE_QUERY =
      "mutation CreateNote($userId: String!, $content: NoteContent!) { createNote(userId: $userId, content: $content) }";

    const stub: SinonStub = StubNotesProjectDataSource("createNote");
    beforeEach(() => {
      stub.resolves("OK");
    });
    afterEach(() => {
      stub.restore();
    });
    it("Calling with good userid and good content, res.data.createNote should return OK", async () => {
      // Arrange
      const op = {
        query: CREATE_NOTE_QUERY,
        variables: {
          userId: "1",
          content: {
            title: "Sample",
            body: "Lorem Impsu",
          },
        },
      };

      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors).to.be.undefined;
      expect(res?.data).to.be.an("object");
      expect(res?.data?.createNote).to.be.an("string");
    });
    it("Calling with good userid and bad content, error code should be 'BAD_USER_INPUT'", async () => {
      // Arrange
      const op = {
        query: CREATE_NOTE_QUERY,
        variables: {
          userId: "1",
          content: {
            title: false,
            body: "Lorem Impsu",
          },
        },
      };
      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors?.[0].extensions?.code).to.equal("BAD_USER_INPUT");
    });
  });
  describe("updateNote", () => {
    const UPDATE_NOTE_QUERY =
      "mutation UpdateNote($id: String!, $content: NoteContent!) { updateNote(id: $id, content: $content) }";

    const stub: SinonStub = StubNotesProjectDataSource("updateNote");
    beforeEach(() => {
      stub.resolves("OK");
    });
    afterEach(() => {
      stub.restore();
    });
    it("Calling with good id and good content, res.data.updateNote should return OK", async () => {
      // Arrange
      const op = {
        query: UPDATE_NOTE_QUERY,
        variables: {
          id: "1",
          content: {
            title: "Sample",
            body: "Lorem Impsu",
          },
        },
      };

      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors).to.be.undefined;
      expect(res?.data).to.be.an("object");
      expect(res?.data?.updateNote).to.be.an("string");
    });
    it("Calling with good id and bad content, error code should be 'BAD_USER_INPUT'", async () => {
      // Arrange
      const op = {
        query: UPDATE_NOTE_QUERY,
        variables: {
          id: "1",
          content: {
            title: false,
            body: "Lorem Impsu",
          },
        },
      };
      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors?.[0].extensions?.code).to.equal("BAD_USER_INPUT");
    });
  });
  describe("deleteNote", () => {
    const DELETE_NOTE_QUERY =
      "mutation DeleteNote($id: String!) { deleteNote(id: $id) }";

    const stub: SinonStub = StubNotesProjectDataSource("deleteNote");
    beforeEach(() => {
      stub.resolves("OK");
    });
    afterEach(() => {
      stub.restore();
    });
    it("Calling with good id, res.data.deleteNote should return OK", async () => {
      // Arrange
      const op = {
        query: DELETE_NOTE_QUERY,
        variables: {
          id: "1",
        },
      };

      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors).to.be.undefined;
      expect(res?.data).to.be.an("object");
      expect(res?.data?.deleteNote).to.be.an("string");
    });
    it("Calling with bad id, error code should be 'BAD_USER_INPUT'", async () => {
      // Arrange
      const op = {
        query: DELETE_NOTE_QUERY,
        variables: {
          id: true,
        },
      };
      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors?.[0].extensions?.code).to.equal("BAD_USER_INPUT");
    });
  });
  describe("createCategory", () => {
    const CREATE_CATEGORY_QUERY =
      "mutation CreateCategory($userId: String!, $content: CategoryContent!) { createCategory(userId: $userId, content: $content) }";

    const stub: SinonStub = StubNotesProjectDataSource("createCategory");
    beforeEach(() => {
      stub.resolves("OK");
    });
    afterEach(() => {
      stub.restore();
    });
    it("Calling with good userid and good content, res.data.createCategory should return OK", async () => {
      // Arrange
      const op = {
        query: CREATE_CATEGORY_QUERY,
        variables: {
          userId: "1",
          content: {
            label: "Sample",
            color: "RED",
          },
        },
      };

      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors).to.be.undefined;
      expect(res?.data).to.be.an("object");
      expect(res?.data?.createCategory).to.be.an("string");
    });
    it("Calling with good userid and bad content, error code should be 'BAD_USER_INPUT'", async () => {
      // Arrange
      const op = {
        query: CREATE_CATEGORY_QUERY,
        variables: {
          userId: "1",
          content: {
            label: "Sample",
            color: "Not a color",
          },
        },
      };
      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors?.[0].extensions?.code).to.equal("BAD_USER_INPUT");
    });
  });
  describe("updateCategory", () => {
    const UPDATE_CATEGORY_QUERY =
      "mutation UpdateCategory($id: String!, $content: CategoryContent!) { updateCategory(id: $id, content: $content) }";

    const stub: SinonStub = StubNotesProjectDataSource("updateCategory");
    beforeEach(() => {
      stub.resolves("OK");
    });
    afterEach(() => {
      stub.restore();
    });
    it("Calling with good id and good content, res.data.updateCategory should return OK", async () => {
      // Arrange
      const op = {
        query: UPDATE_CATEGORY_QUERY,
        variables: {
          id: "1",
          content: {
            label: "Sample",
            color: "RED",
          },
        },
      };

      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors).to.be.undefined;
      expect(res?.data).to.be.an("object");
      expect(res?.data?.updateCategory).to.be.an("string");
    });
    it("Calling with good id and bad content, error code should be 'BAD_USER_INPUT'", async () => {
      // Arrange
      const op = {
        query: UPDATE_CATEGORY_QUERY,
        variables: {
          id: "1",
          content: {
            label: false,
            color: "RED",
          },
        },
      };
      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors?.[0].extensions?.code).to.equal("BAD_USER_INPUT");
    });
  });
  describe("deleteCategory", () => {
    const DELETE_CATEGORY_QUERY =
      "mutation DeleteCategory($id: String!) { deleteCategory(id: $id) }";

    const stub: SinonStub = StubNotesProjectDataSource("deleteCategory");
    beforeEach(() => {
      stub.resolves("OK");
    });
    afterEach(() => {
      stub.restore();
    });
    it("Calling with good id, res.data.deleteCategory should return OK", async () => {
      // Arrange
      const op = {
        query: DELETE_CATEGORY_QUERY,
        variables: {
          id: "1",
        },
      };

      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors).to.be.undefined;
      expect(res?.data).to.be.an("object");
      expect(res?.data?.deleteCategory).to.be.an("string");
    });
    it("Calling with bad id, error code should be 'BAD_USER_INPUT'", async () => {
      // Arrange
      const op = {
        query: DELETE_CATEGORY_QUERY,
        variables: {
          id: false,
        },
      };
      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors?.[0].extensions?.code).to.equal("BAD_USER_INPUT");
    });
  });
  describe("addCategoryNote", () => {
    const ADD_CATEGORY_NOTE_QUERY =
      "mutation addCategoryNote($categoryId: String!, $noteId: String!) { addCategoryNote(categoryId: $categoryId, noteId: $noteId) }";

    const stub: SinonStub = StubNotesProjectDataSource("addCategoryNote");
    beforeEach(() => {
      stub.resolves("OK");
    });
    afterEach(() => {
      stub.restore();
    });
    it("Calling with good ids, res.data.addCategoryNote should return OK", async () => {
      // Arrange
      const op = {
        query: ADD_CATEGORY_NOTE_QUERY,
        variables: {
          categoryId: "1",
          noteId: "1",
        },
      };

      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors).to.be.undefined;
      expect(res?.data).to.be.an("object");
      expect(res?.data?.addCategoryNote).to.be.an("string");
    });
    it("Calling with bad ids, error code should be 'BAD_USER_INPUT'", async () => {
      // Arrange
      const op = {
        query: ADD_CATEGORY_NOTE_QUERY,
        variables: {
          categoryId: false,
          noteId: "1",
        },
      };
      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors?.[0].extensions?.code).to.equal("BAD_USER_INPUT");
    });
  });
  describe("deleteCategoryNote", () => {
    const DELETE_CATEGORY_NOTE_QUERY =
      "mutation DeleteCategoryNote($categoryId: String!, $noteId: String!) { deleteCategoryNote(categoryId: $categoryId, noteId: $noteId) }";

    const stub: SinonStub = StubNotesProjectDataSource("deleteCategoryNote");
    beforeEach(() => {
      stub.resolves("OK");
    });
    afterEach(() => {
      stub.restore();
    });
    it("Calling with good ids, res.data.deleteCategoryNote should return OK", async () => {
      // Arrange
      const op = {
        query: DELETE_CATEGORY_NOTE_QUERY,
        variables: {
          categoryId: "1",
          noteId: "1",
        },
      };

      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors).to.be.undefined;
      expect(res?.data).to.be.an("object");
      expect(res?.data?.deleteCategoryNote).to.be.an("string");
    });
    it("Calling with bad ids, error code should be 'BAD_USER_INPUT'", async () => {
      // Arrange
      const op = {
        query: DELETE_CATEGORY_NOTE_QUERY,
        variables: {
          categoryId: false,
          noteId: "1",
        },
      };
      // Act
      const res = await server?.executeOperation(op);
      // Assert
      expect(res?.errors?.[0].extensions?.code).to.equal("BAD_USER_INPUT");
    });
  });
}

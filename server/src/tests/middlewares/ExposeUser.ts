import "reflect-metadata";
import { expect } from "chai";
import Sinon from "sinon";
import { ExposeUser } from "../../graphql/middlewares";

const CLAIM = `http://www.${process.env.AUTH0_AUDIENCE}.com/user`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function run(payload: any, db: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context: any = {
    user: {},
    request: { auth: { credentials: { payload } } },
    dataSources: { notesProject: db },
  };
  const next = Sinon.stub().resolves();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { context, next, promise: (ExposeUser as any)({ context }, next) };
}

function fakeDb() {
  return {
    getUserByOauthId: Sinon.stub().resolves(undefined),
    getUserByEmail: Sinon.stub().resolves(undefined),
    linkOauthId: Sinon.stub().resolves(),
    createOauthUser: Sinon.stub().resolves(),
  };
}

describe("ExposeUser middleware", () => {
  it("uses the user found by oauthId", async () => {
    const db = fakeDb();
    db.getUserByOauthId.resolves({ id: "7", oauthId: "auth0|a" });
    const { context, next, promise } = run({ sub: "auth0|a" }, db);
    await promise;
    expect(context.user.id).to.equal("7");
    expect(next.calledOnce).to.be.true;
    expect(db.createOauthUser.called).to.be.false;
  });

  it("creates the user on first login instead of crashing", async () => {
    const db = fakeDb();
    db.getUserByOauthId.onSecondCall().resolves({ id: "9" });
    const { context, promise } = run(
      { sub: "auth0|new", [CLAIM]: { email: "a@b.c", email_verified: true, name: "A" } },
      db
    );
    await promise;
    expect(db.createOauthUser.calledOnceWith({ oauthId: "auth0|new", email: "a@b.c", name: "A" })).to.be.true;
    expect(context.user.id).to.equal("9");
  });

  it("links a legacy user (no oauthId) by verified email", async () => {
    const db = fakeDb();
    db.getUserByEmail.resolves({ id: "3", oauthId: null });
    db.getUserByOauthId.onSecondCall().resolves({ id: "3" });
    const { context, promise } = run({ sub: "auth0|x", [CLAIM]: { email: "a@b.c", email_verified: true } }, db);
    await promise;
    expect(db.linkOauthId.calledOnceWith("3", "auth0|x")).to.be.true;
    expect(context.user.id).to.equal("3");
  });

  it("never links or stores an unverified email", async () => {
    const db = fakeDb();
    db.getUserByEmail.resolves({ id: "3", oauthId: null });
    db.getUserByOauthId.onSecondCall().resolves({ id: "10" });
    const { context, promise } = run({ sub: "auth0|evil", [CLAIM]: { email: "a@b.c" } }, db);
    await promise;
    expect(db.linkOauthId.called).to.be.false;
    expect(db.createOauthUser.firstCall.args[0].email).to.be.undefined;
    expect(context.user.id).to.equal("10");
  });

  it("does not steal an email owned by another identity", async () => {
    const db = fakeDb();
    db.getUserByEmail.resolves({ id: "3", oauthId: "google-oauth2|1" });
    db.getUserByOauthId.onSecondCall().resolves({ id: "11" });
    const { context, promise } = run({ sub: "auth0|y", [CLAIM]: { email: "a@b.c", email_verified: true } }, db);
    await promise;
    expect(db.linkOauthId.called).to.be.false;
    expect(db.createOauthUser.firstCall.args[0].email).to.be.undefined;
    expect(context.user.id).to.equal("11");
  });

  it("throws an AuthenticationError without 'sub'", async () => {
    const { promise } = run({}, fakeDb());
    const err = await promise.catch((e: Error) => e);
    expect(err).to.have.property("extensions").that.has.property("code", "UNAUTHENTICATED");
  });
});

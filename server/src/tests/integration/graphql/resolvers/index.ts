// import { Mutations } from '../../../../graphql'
import "reflect-metadata";
import Mutations from "./mutations";
import Queries from "./queries";

export default function Tests() {
  describe("Mutations", () => Mutations());
  describe("Queries", () => Queries());
}

import { gql } from "apollo-server-hapi";

export default gql`
  type Query {
    numberOne: Int
    numberTwo: Int
  }
`;

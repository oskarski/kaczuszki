/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDuck = /* GraphQL */ `
  query GetDuck($id: ID!) {
    getDuck(id: $id) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const listDucks = /* GraphQL */ `
  query ListDucks(
    $filter: ModelDuckFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDucks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createDuck = /* GraphQL */ `
  mutation CreateDuck(
    $input: CreateDuckInput!
    $condition: ModelDuckConditionInput
  ) {
    createDuck(input: $input, condition: $condition) {
      id
      name
      description
      image
      speed
      pitch
      createdAt
      updatedAt
    }
  }
`;
export const updateDuck = /* GraphQL */ `
  mutation UpdateDuck(
    $input: UpdateDuckInput!
    $condition: ModelDuckConditionInput
  ) {
    updateDuck(input: $input, condition: $condition) {
      id
      name
      description
      image
      speed
      pitch
      createdAt
      updatedAt
    }
  }
`;
export const deleteDuck = /* GraphQL */ `
  mutation DeleteDuck(
    $input: DeleteDuckInput!
    $condition: ModelDuckConditionInput
  ) {
    deleteDuck(input: $input, condition: $condition) {
      id
      name
      description
      image
      speed
      pitch
      createdAt
      updatedAt
    }
  }
`;

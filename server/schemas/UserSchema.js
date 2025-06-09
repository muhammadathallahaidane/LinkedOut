import UserModel from "../models/UserModel.js";

export const userTypeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
  }

  input CreateUserInput {
    name: String
    username: String
    email: String
    password: String
 }

  type Mutation {
    createUser(newUser: CreateUserInput): String
  }

    type Query {
        books: [Posts]
    }`;

export const userResolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createUser: async function (_, args) {
      const { newUser } = args;
      // Here you would typically call a function to save the user to your database
      // For now, we will just return a success message
      console.log("TEST >>>>>>>>>>>>>>");

      const message = await UserModel.insert(newUser);
      return message;
    },
  },
};

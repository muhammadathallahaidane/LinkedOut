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
    createToken(username: String, password: String): String
  }`;

export const userResolvers = {
  Query: {
    createToken: async function(_, args) {
      const {
        username,
        password
      } = args

      const message = await UserModel.login(username, password)
      return message
    }
  },
  Mutation: {
    createUser: async function (_, args) {
      const { newUser } = args;
      // Here you would typically call a function to save the user to your database
      // For now, we will just return a success message
      const message = await UserModel.register(newUser);
      return message;
    },
  },
};

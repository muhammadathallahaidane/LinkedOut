import UserModel from "../models/UserModel.js";

export const userTypeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
    followers: [User]
    followings: [User]
  }

  input CreateUserInput {
    name: String
    username: String!
    email: String!
    password: String!
 }

  type Query {
    login(username: String, password: String): String
    search(keyword: String): [User]
    getUser(id: ID): User
  }

  type Mutation {
    createUser(newUser: CreateUserInput): String
  }`;

export const userResolvers = {
  Query: {
    login: async function (_, args) {
      const { username, password } = args;

      const token = await UserModel.login(username, password);
      return token;
    },
    search: async function (_, args, contextValue) {
      const { id } = contextValue.authN();
      if (!id) {
        throw new Error("Unauthorized");
      }

      const { keyword } = args;
      const users = await UserModel.search(keyword);
      return users;
    },
    getUser: async function (_, args, contextValue) {
      const { id: loginId } = contextValue.authN();
      if (!loginId) {
        throw new Error("Unauthorized");
      }

      const { id } = args
      const user = await UserModel.findById(id)
      return user
    },
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

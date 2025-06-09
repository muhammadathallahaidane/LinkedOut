import 'dotenv/config'
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import UserModel from "./models/UserModel.js";

export const typeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
    password: String
  }

  type Posts {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    comments: [Comments]
    likes: [Likes]
    createdAt: String
    updatedAt: String
  }

  type Comments {
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Likes {
    username: String
    createdAt: String
    updatedAt: String
  }

  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
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
    }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createUser: async function(_, args) {
        const { newUser } = args
        // Here you would typically call a function to save the user to your database
        // For now, we will just return a success message
        console.log("TEST >>>>>>>>>>>>>>");
        
        const message = await UserModel.insert(newUser);
        return message
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 3000 },
});

console.log(`🚀  Server ready at: ${url}`);

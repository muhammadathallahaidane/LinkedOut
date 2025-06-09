import UserModel from "../models/UserModel.js";

export const followTypeDefs = `#graphql
  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
 }

  type Mutation {
    createUser(newUser: CreateUserInput): String
  }

    type Query {
        books: [Posts]
    }`

export const followResolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    createUser: async function(_, args) {
        const { newUser } = args
        // Here you would typically call a function to save the user to your database
        // For now, we will just return a success message
        console.log("TEST >>>>>>>>>>>>>>");
        
        const message = await UserModel.register(newUser);
        return message
    }
  }
};
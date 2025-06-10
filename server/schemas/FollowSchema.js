import FollowModel from "../models/FollowModel.js";

export const followTypeDefs = `#graphql
  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
 }

 input CreateFollow {
    followingId: ID
 }
 
  type Query {
    books: [Posts]
  }

  type Mutation {
    followUser(payload: CreateFollow): String
  }`

export const followResolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    followUser: async function(_, args, contextValue) {
      const {id} = contextValue.authN()
      if (!id) {
        throw new Error("Unauthorized");
        
      }
      const { payload } = args
      const message = await FollowModel.followUser(id, payload)
      return message
    }
  }
};
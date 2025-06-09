import UserModel from "../models/UserModel.js";

export const postsTypeDefs = `#graphql
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

  type Mutation {
    createUser(newUser: CreateUserInput): String
  }

    type Query {
        books: [Posts]
    }`

export const postsResolvers = {
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
import PostModel from "../models/PostModel.js";

export const postsTypeDefs = `#graphql
 type Post {
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

  input CreatePostInput {
    content: String
    tags: [String]
    imgUrl: String
  }

  type Mutation {
    createPosts(newPost: CreatePostInput): Post
  }

  type Query {
    getPost(id: ID): Post
    getAllPost: [Post]
  }`;

export const postsResolvers = {
  Query: {
    getPost: async function (_, args, contextValue) {
      const { id: loginId } = contextValue.authN();
      if (!loginId) {
        throw new Error("Unauthorized");
      }

      const { id } = args;

      const post = await PostModel.findById(id);
      return post;
    },
    getAllPost: async function (_, _args, contextValue) {
      const { id: loginId } = contextValue.authN();
      if (!loginId) {
        throw new Error("Unauthorized");
      }

      const post = await PostModel.findAll()
      return post
    },
  },
  Mutation: {
    createPosts: async function (_, args, contextValue) {
      const { id } = contextValue.authN();
      if (!id) {
        throw new Error("Unauthorized");
      }
      const { content, tags, imgUrl } = args.newPost;

      const posts = await PostModel.createPosts({
        content,
        tags,
        imgUrl,
        comments: [],
        likes: [],
        id,
      });

      return posts;
    },
  },
};

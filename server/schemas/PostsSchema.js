import PostModel from "../models/PostModel.js";
import redis from "../config/redis.js"

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
    authorData: [User]
  }

  type Comments {
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Likes {
    username: String!
    createdAt: String
    updatedAt: String
  }

  input CreatePostInput {
    content: String!
    tags: [String]
    imgUrl: String
  }

  type Mutation {
    createPosts(newPost: CreatePostInput): Post
    addComment(postId: ID, content: String!): String
    addLike(postId: ID): String
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

      const cache = await redis.get("posts")
      if (cache) {
        const posts = JSON.parse(cache)
        return posts
      }

      const posts = await PostModel.findAll();
      await redis.set("posts", JSON.stringify(posts))

      return posts;
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

      await redis.del("posts")

      return posts;
    },
    addComment: async function (_, args, contextValue) {
      const { id, username } = contextValue.authN();
      if (!id) {
        throw new Error("Unauthorized");
      }

      const { postId, content } = args;

      const message = await PostModel.addComment(postId, username, content)
      return message
    },
    addLike: async function (_, args, contextValue) {
      const { id, username } = contextValue.authN();
      if (!id) {
        throw new Error("Unauthorized");
      }

      const { postId } = args

      const message = await PostModel.addLike(postId, username)
      return message
    }
  },
};

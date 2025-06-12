import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.js";

export default class PostModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("posts");

    return collection;
  }

  static async createPosts(payload) {
    const { content, tags, imgUrl, comments, likes, id } = payload;

    if (!content) {
      throw new Error("Content required");
    }

    if (!id) {
      throw new Error("Author ID required")
    }

    const newPost = {
      content,
      tags,
      imgUrl,
      authorId: new ObjectId(id),
      comments,
      likes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const post = await this.getCollection().insertOne(newPost);
    console.log(post);

    return {
      id: post.insertedId,
      ...newPost,
    };
  }

  static async findById(id) {
    const post = await this.getCollection()
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "authorData",
          },
        },
        {
          $project: {
            "authorData._id": 0,
            "authorData.email": 0,
            "authorData.password": 0,
          },
        },
      ])
      .toArray();

    if (post.length < 1) {
      throw new Error("Post not found");
    }

    return post[0];
  }

  static async findAll() {
    const post = await this.getCollection()
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "authorData",
          },
        },
        {
          $project: {
            "authorData._id": 0,
            "authorData.email": 0,
            "authorData.password": 0,
          },
        },
        { $sort: { createdAt: -1 } }
      ])
      .toArray();

    return post;
  }

  static async addComment(postId, username, content) {
    if (!content) {
      throw new Error("Content required")
    }

    if (!username) {
      throw new Error("Username required")
    }

    await this.getCollection().updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: {
          comments: {
            content,
            username,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      }
    );
    return "Comment added succesfully";
  }

  static async addLike(postId, username) {
    if (!username) {
      throw new Error("Username required")
    }


    const postExists = await this.getCollection().findOne({
      _id: new ObjectId(postId),
    });

    if (!postExists) {
      throw new Error("Post not found");
    }
    
    const alreadyLike = await this.getCollection().findOne({
      _id: new ObjectId(postId),
      "likes.username": username,
    });

    if (alreadyLike) {
      throw new Error("You have already liked this post");
    }


    await this.getCollection().updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: {
          likes: {
            username,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      }
    );
    return "Post liked!";
  }
}

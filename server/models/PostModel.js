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
      ...newPost
    };
  }
}

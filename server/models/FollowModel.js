import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.js";
// import bcrypt from "bcryptjs";
// import * as EmailValidator from "email-validator";
// import jwt from "jsonwebtoken";

export default class FollowModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("follows");

    return collection;
  }

  static async followUser(id, payload) {
    const followerId = id
    const followingId = payload.followingId
    
    const alreadyFollow = await this.getCollection().findOne({
      followerId,
      followingId
    });

    if (alreadyFollow) {
      throw new Error("You are already following this user");
    }

    if (followerId === followingId) {
      throw new Error("You cannot follow yourself");
    }


    await this.getCollection().insertOne({
      followerId: new ObjectId(followerId),
      followingId: new ObjectId(followingId),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return "User followed successfully";
  }
}

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
    const follower = await this.getCollection().findOne({
      _id: new ObjectId(id),
    });
    if (!follower) {
      throw new Error("User not found");
    }
    const following = await this.getCollection().findOne({
      _id: new ObjectId(payload.followingId),
    });
    if (!following) {
      throw new Error("User not found");
    }

    await this.getCollection().insertOne({
      followerId: new ObjectId(id),
      followingId: new ObjectId(payload.followingId)
    })
   
    return "User followed successfully"
  }
}

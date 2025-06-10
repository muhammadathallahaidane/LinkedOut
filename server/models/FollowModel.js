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

 static async followUser(_id, payload) {
  
 }
}

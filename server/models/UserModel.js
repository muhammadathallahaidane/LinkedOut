import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.js";
import bcrypt from "bcryptjs";
import * as EmailValidator from "email-validator";
import jwt from "jsonwebtoken";

export default class UserModel {
  static getCollection() {
    const db = getDB();
    const collection = db.collection("users");

    return collection;
  }

  static async register(payload) {
    let errorMessage = "";
    const emailUser = await this.getCollection().findOne({
      email: payload.email,
    });
    if (emailUser) {
      errorMessage += "Email already exists. ";
    }

    const usernameUser = await this.getCollection().findOne({
      username: payload.username,
    });
    if (usernameUser) {
      errorMessage += "Username already exists. ";
    }

    if (!payload.username || !payload.email || !payload.password) {
      errorMessage += "Username, email, and password are required. ";
    }

    if (payload.password.length < 5) {
      errorMessage += "Password must be 5 characters or more. ";
    }

    if (!EmailValidator.validate(payload.email)) {
      errorMessage += "Email format must be valid. ";
    }

    if (errorMessage) {
      throw new Error(errorMessage.trim());
    }

    payload.password = bcrypt.hashSync(payload.password, 10);

    await this.getCollection().insertOne(payload);

    return "User registered successfully";
  }

  static async login(username, password) {
    const findUser = await this.getCollection().findOne({ username: username });
    if (!findUser) {
      throw new Error("User not found");
    }

    const checkPassword = bcrypt.compareSync(password, findUser.password);
    if (!checkPassword) {
      throw new Error("Password incorrect");
    }

    let payload = {
      username,
      password,
    };
    let token = jwt.sign(payload, process.env.JWT_SECRET);

    return token;
  }
}

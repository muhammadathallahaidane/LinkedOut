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

  static async findById(id) {
    const user = await this.getCollection()
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id)
          }
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followingId",
            as: "followersData",
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followerId",
            as: "followingsData",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followersData.followerId",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "followingsData.followingId",
            foreignField: "_id",
            as: "followings",
          },
        },
        {
          $project: {
            followersData: 0,
            followingsData: 0,
            password: 0,
            "followers.password": 0,
            "followings.password": 0,
          },
        },
      ])
      .toArray();
    if (user.length < 1) {
      throw new Error("User not found");
    }
    return user[0];
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
      id: findUser._id,
      username: findUser.username,
    };

    let token = jwt.sign(payload, process.env.JWT_SECRET);

    return token;
  }

  static async search(name, username) {
    const searchCriteria = [];

    if (name) {
      searchCriteria.push({ name: { $regex: name, $options: "i" } });
    }

    if (username) {
      searchCriteria.push({ username: { $regex: username, $options: "i" } });
    }

    if (searchCriteria.length === 0) {
      throw new Error("Please provide name or username to search");
    }

    const users = await this.getCollection()
      .find({
        $or: searchCriteria,
      })
      .toArray();

    if (users.length === 0) {
      throw new Error("No users found matching the search criteria");
    }

    // Remove password from results for security
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

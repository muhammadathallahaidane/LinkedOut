import { ObjectId } from "mongodb";
import { getDB } from "../config/mongodb.js";

export default class UserModel {
    static getCollection() {
        const db = getDB()
        const collection = db.collection("users")

        return collection
    }

    static async insert(payload) {
        console.log(payload);
        
        await this.getCollection().insertOne(payload)
        console.log("User inserted successfully");
        
        return "User registered successfully"
    }
}
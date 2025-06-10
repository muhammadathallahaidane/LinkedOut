import 'dotenv/config'
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers, userTypeDefs } from './schemas/UserSchema.js';
import { postsResolvers, postsTypeDefs } from './schemas/PostsSchema.js';
import { followResolvers, followTypeDefs } from './schemas/FollowSchema.js';
import jwt from "jsonwebtoken"

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postsTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postsResolvers, followResolvers]
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 3000 },
  context: async function ({req, res}) {
    return {
      authN: function() {
        if (!req.headers.authorization) {
          throw new Error("Unauthorized")
        }
        
        const token = req.headers.authorization.split(" ")[1]
        if (!token) {
          throw new Error("Unauthorized")
        }

        let payload = jwt.verify(token, process.env.JWT_SECRET)
        return payload
      }
    }
  }
});

console.log(`🚀  Server ready at: ${url}`);

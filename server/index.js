import 'dotenv/config'
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers, userTypeDefs } from './schemas/UserSchema.js';
import { postsResolvers, postsTypeDefs } from './schemas/PostsSchema.js';
import { followResolvers, followTypeDefs } from './schemas/FollowSchema.js';

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postsTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postsResolvers, followResolvers]
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 3000 },
});

console.log(`🚀  Server ready at: ${url}`);

import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { resolvers } from "./resolvers";
import { connectToMongo } from "./utils/mongo";
import { verifyJwt } from "./utils/jwt";
import { User } from "./schema/user.schema";
import Context from "./types/context";
import authChecker from "./utils/authChecker";
dotenv.config();

async function bootstrap() {
  const schema = await buildSchema({
    resolvers,
    authChecker,
  });
  const app = express();
  app.use(cookieParser());
  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      const context = ctx;
      if (ctx.req.cookies.accessToken) {
        const user = verifyJwt<User>(ctx.req.cookies.accessToken);
        context.user = user;
      }
      return ctx;
    },
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
  await server.start();
  server.applyMiddleware({ app });
  app.listen({ port: 4000 }, () => {
    console.log("Server running on port 4000");
  });
  connectToMongo();
}
bootstrap();

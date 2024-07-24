import {
  CreateUserInput,
  LoginInput,
  UserModel,
} from "@src/schema/user.schema";
import Context from "@src/types/context";
import { signJwt } from "@src/utils/jwt";
import { ApolloError } from "apollo-server-express";
import bcrypt from "bcrypt";
class UserService {
  async createUser(input: CreateUserInput) {
    return UserModel.create(input);
  }

  async login(input: LoginInput, context: Context) {
    const user = await UserModel.find().findByEmail(input.email).lean();
    if (!user) {
      throw new ApolloError("Invalid email or password");
    }
    const passwordIsValid = await bcrypt.compare(input.password, user.password);
    if (!passwordIsValid) {
      throw new ApolloError("Invalid email or password");
    }
    const token = signJwt(user);
    context.res.cookie("accessToken", token, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return token;
  }
}

export default UserService;

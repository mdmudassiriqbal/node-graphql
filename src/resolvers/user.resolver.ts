import UserService from "@src/service/user.service";
import { CreateUserInput, LoginInput, User } from "../schema/user.schema";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import Context from "@src/types/context";

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }
  @Mutation(() => User)
  createUser(@Arg("input") input: CreateUserInput) {
    console.log("🚀 ~ UserResolver ~ createUser ~ input:", input);
    return this.userService.createUser(input);
  }
  @Mutation(() => String) // Returns the JWT
  login(@Arg("input") input: LoginInput, @Ctx() context: Context) {
    console.log("🚀 ~ UserResolver ~ createUser ~ input:", input);
    return this.userService.login(input, context);
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() context: Context) {
    return context.user;
  }
}

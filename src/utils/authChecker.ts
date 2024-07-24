import Context from "@src/types/context";
import { AuthChecker } from "type-graphql";

const authChecker: AuthChecker<Context> = ({ context }) => {
  return !!context.user;
};

export default authChecker;

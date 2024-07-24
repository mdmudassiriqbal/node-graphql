import jwt from "jsonwebtoken";

export function signJwt(object: Object, option?: jwt.SignOptions) {
  return jwt.sign(object, "mySecret", {
    ...option,
    // algorithm: "RS256",
  });
}

export function verifyJwt<T>(token: string): T | null {
  try {
    return jwt.verify(token, "mySecret") as T;
  } catch (e) {
    return null;
  }
}

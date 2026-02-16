import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

type TokenPayload = {
  userId: string;
};

export function getUserId(req:Request): string | null {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", ""); 
    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as TokenPayload;

    return decoded.userId;
  } catch (err) {
    return null;
  }
}

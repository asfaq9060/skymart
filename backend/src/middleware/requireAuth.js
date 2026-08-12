import jwt from "jsonwebtoken";
import User from "../models/User.js";

const developmentSecret = "sky-mart-development-secret-change-before-production";

export function getJwtSecret() {
  return process.env.JWT_SECRET ?? developmentSecret;
}

export function requireAuth(request, response, next) {
  const authorization = request.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) return response.status(401).json({ error: "Please log in to continue." });

  try {
    request.userId = jwt.verify(token, getJwtSecret()).sub;
    return next();
  } catch {
    return response.status(401).json({ error: "Your session has expired. Please log in again." });
  }
}

export async function requireAdmin(request, response, next) {
  try {
    const user = await User.findById(request.userId).select("role").lean();
    if (!user || user.role !== "admin") {
      return response.status(403).json({ error: "Only administrators can manage products." });
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

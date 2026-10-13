import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import User from "../models/User.js";
import { getJwtSecret } from "../middleware/requireAuth.js";

const router = Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    getJwtSecret(),
    { expiresIn: "7d" },
  );
}

// REGISTER WITHOUT OTP
router.post("/register", async (request, response, next) => {
  try {
    const name = request.body.name?.trim();
    const email = request.body.email?.trim().toLowerCase();
    const password = request.body.password;

    if (
      !name ||
      !emailPattern.test(email || "") ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return response.status(400).json({
        error:
          "Enter your name, a valid email, and a password of at least 8 characters.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return response.status(409).json({
        error: "An account already exists for this email. Please log in.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    return response.status(201).json({
      user: publicUser(user),
      token: createToken(user),
      message: "Account created successfully.",
    });
  } catch (error) {
    // Handle duplicate email if concurrent requests race.
    if (error.code === 11000) {
      return response.status(409).json({
        error: "An account already exists for this email. Please log in.",
      });
    }

    return next(error);
  }
});

// LOGIN WITHOUT OTP
router.post("/login", async (request, response, next) => {
  try {
    const email = request.body.email?.trim().toLowerCase();
    const password = request.body.password;

    if (
      !emailPattern.test(email || "") ||
      typeof password !== "string" ||
      password.length === 0
    ) {
      return response.status(400).json({
        error: "Enter a valid email address and password.",
      });
    }

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return response.status(401).json({
        error: "Email or password is incorrect.",
      });
    }

    return response.json({
      user: publicUser(user),
      token: createToken(user),
    });
  } catch (error) {
    return next(error);
  }
});

// GET CURRENT USER
router.get("/me", async (request, response) => {
  try {
    const authorization = request.get("authorization") ?? "";
    const token = authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    if (!token) {
      return response.status(401).json({
        error: "Please log in to continue.",
      });
    }

    const payload = jwt.verify(token, getJwtSecret());
    const user = await User.findById(payload.sub);

    if (!user) {
      return response.status(401).json({
        error: "Your account is no longer available.",
      });
    }

    return response.json({ user: publicUser(user) });
  } catch {
    return response.status(401).json({
      error: "Your session has expired. Please log in again.",
    });
  }
});

export default router;

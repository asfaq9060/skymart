import bcrypt from "bcryptjs";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import jwt from "jsonwebtoken";
import { Router } from "express";
import User from "../models/User.js";
import { getJwtSecret } from "../middleware/requireAuth.js";
import { VerificationEmailError, sendVerificationCode } from "../services/verificationEmail.js";

const router = Router();
const emailPattern =
  /^[A-Z0-9][A-Z0-9._%+-]{0,62}@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

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

function createVerificationCode() {
  const code = String(randomInt(100000, 1000000));
  return {
    code,
    hash: createHash("sha256").update(code).digest("hex"),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  };
}

function isValidVerificationCode(code) {
  return typeof code === "string" && /^\d{6}$/.test(code);
}

router.post("/register", async (request, response, next) => {
  try {
    const name = request.body.name?.trim();
    const email = request.body.email?.trim().toLowerCase();
    const password = request.body.password;

    if (
      !name ||
      !emailPattern.test(email) ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return response
        .status(400)
        .json({
          error:
            "Enter your name, a valid email, and a password of at least 8 characters.",
        });
    }
    let user = await User.findOne({ email }).select("+passwordHash");
    if (user?.emailVerified) {
      return response
        .status(409)
        .json({ error: "An account already exists for this email. Please log in." });
    }

    const verification = createVerificationCode();
    if (user) {
      user.name = name;
      user.passwordHash = await bcrypt.hash(password, 12);
      user.verificationCodeHash = verification.hash;
      user.verificationCodeExpiresAt = verification.expiresAt;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        passwordHash: await bcrypt.hash(password, 12),
        emailVerified: false,
        verificationCodeHash: verification.hash,
        verificationCodeExpiresAt: verification.expiresAt,
      });
    }

    await sendVerificationCode(email, verification.code);
    return response.status(201).json({
      email,
      message: "We sent a six-digit verification code to your email address.",
    });
  } catch (error) {
    if (error instanceof VerificationEmailError) {
      return response.status(503).json({ error: error.message });
    }
    return next(error);
  }
});

router.post("/verify-email", async (request, response, next) => {
  try {
    const email = request.body.email?.trim().toLowerCase();
    const code = request.body.code?.trim();
    if (!email || !emailPattern.test(email) || !isValidVerificationCode(code)) {
      return response.status(400).json({ error: "Enter the six-digit verification code." });
    }

    const user = await User.findOne({ email }).select("+verificationCodeHash");
    if (!user || user.emailVerified || !user.verificationCodeHash || !user.verificationCodeExpiresAt) {
      return response.status(400).json({ error: "This verification code is invalid. Register again to receive a new code." });
    }
    if (user.verificationCodeExpiresAt.getTime() < Date.now()) {
      return response.status(400).json({ error: "This verification code has expired. Register again to receive a new code." });
    }

    const receivedCodeHash = createHash("sha256").update(code).digest("hex");
    if (!timingSafeEqual(Buffer.from(receivedCodeHash), Buffer.from(user.verificationCodeHash))) {
      return response.status(400).json({ error: "This verification code is incorrect." });
    }

    user.emailVerified = true;
    user.verificationCodeHash = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();
    return response.json({ user: publicUser(user), token: createToken(user) });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (request, response, next) => {
  try {
    const email = request.body.email?.trim().toLowerCase();
    const password = request.body.password;
    if (
      !email ||
      !emailPattern.test(email) ||
      typeof password !== "string" ||
      password.length === 0
    ) {
      return response
        .status(400)
        .json({ error: "Enter a valid email address and password." });
    }
    const user = await User.findOne({ email }).select("+passwordHash");

    if (
      !user ||
      typeof password !== "string" ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      return response
        .status(401)
        .json({ error: "Email or password is incorrect." });
    }
    if (!user.emailVerified) {
      return response.status(403).json({
        error: "Verify your email before logging in. Register again to receive a new code.",
      });
    }
    return response.json({ user: publicUser(user), token: createToken(user) });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", async (request, response) => {
  try {
    const authorization = request.get("authorization") ?? "";
    const token = authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;
    if (!token)
      return response.status(401).json({ error: "Please log in to continue." });

    const payload = jwt.verify(token, getJwtSecret());
    const user = await User.findById(payload.sub);
    if (!user)
      return response
        .status(401)
        .json({ error: "Your account is no longer available." });
    return response.json({ user: publicUser(user) });
  } catch {
    return response
      .status(401)
      .json({ error: "Your session has expired. Please log in again." });
  }
});

export default router;

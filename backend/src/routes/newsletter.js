import { Router } from "express";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

const router = Router();
const emailPattern =
  /^[A-Z0-9][A-Z0-9._%+-]{0,62}@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

router.post("/subscribe", async (request, response, next) => {
  try {
    const email = request.body.email?.trim().toLowerCase();
    if (!email || !emailPattern.test(email)) {
      return response.status(400).json({ error: "Enter a valid email address." });
    }

    if (await NewsletterSubscriber.exists({ email })) {
      return response.status(409).json({ error: "This email is already subscribed." });
    }

    await NewsletterSubscriber.create({ email });
    return response.status(201).json({ message: "Thanks for subscribing. You are now on our updates list." });
  } catch (error) {
    if (error?.code === 11000) {
      return response.status(409).json({ error: "This email is already subscribed." });
    }
    return next(error);
  }
});

export default router;

import "dotenv/config";
import User from "../models/User.js";
import { connectDatabase, disconnectDatabase } from "../config/database.js";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: npm run make-admin -- your-email@example.com");
  process.exit(1);
}

try {
  await connectDatabase();
  const user = await User.findOneAndUpdate({ email }, { $set: { role: "admin" } }, { new: true });
  if (!user) {
    console.error("No account exists for that email. Register the account first, then run this command again.");
    process.exitCode = 1;
  } else {
    console.log(`${user.email} is now an administrator.`);
  }
} finally {
  await disconnectDatabase();
}

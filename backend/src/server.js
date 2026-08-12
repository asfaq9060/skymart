import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { seedProductsIfEmpty } from "./services/productSeed.js";
import { seedCoupons } from "./services/couponSeed.js";

const port = Number(process.env.PORT ?? 5000);

async function startServer() {
  await connectDatabase();

  if (process.env.SEED_DATABASE !== "false") {
    await seedProductsIfEmpty();
    await seedCoupons();
  }

  app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Unable to start API:", error.message);
  if (error.name === "MongooseServerSelectionError") {
    console.error("MongoDB is not running. Start MongoDB locally or set MONGODB_URI to a MongoDB Atlas connection string.");
  }
  process.exit(1);
});

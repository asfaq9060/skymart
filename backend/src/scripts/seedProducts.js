import "dotenv/config";
import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { replaceSeedProducts } from "../services/productSeed.js";

try {
  await connectDatabase();
  await replaceSeedProducts();
} finally {
  await disconnectDatabase();
}

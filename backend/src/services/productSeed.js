import Product from "../models/Product.js";
import { seedProducts } from "../data/products.js";

export async function seedProductsIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) return false;

  await Product.insertMany(seedProducts);
  console.log(`Seeded ${seedProducts.length} products.`);
  return true;
}

export async function replaceSeedProducts() {
  await Product.bulkWrite(
    seedProducts.map((product) => ({
      updateOne: {
        filter: { productId: product.productId },
        update: { $set: product },
        upsert: true,
      },
    })),
  );
  console.log(`Upserted ${seedProducts.length} products.`);
}

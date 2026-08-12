import { Router } from "express";
import Product from "../models/Product.js";
import { requireAdmin, requireAuth } from "../middleware/requireAuth.js";
import { serialiseProduct } from "../utils/serialiseProduct.js";

const validCategories = new Set(["women", "men", "kid"]);
const validSorts = new Set(["featured", "price_asc", "price_desc"]);

function getBaseUrl(request) {
  return `${request.protocol}://${request.get("host")}`;
}

function buildSort(sort) {
  if (sort === "price_asc") return { newPrice: 1, productId: 1 };
  if (sort === "price_desc") return { newPrice: -1, productId: 1 };
  return { productId: 1 };
}

const router = Router();

function isValidImageUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

router.get("/", async (request, response, next) => {
  try {
    const { category, sort = "featured", limit } = request.query;

    if (category && !validCategories.has(category)) {
      return response.status(400).json({ error: "category must be women, men, or kid." });
    }
    if (!validSorts.has(sort)) {
      return response.status(400).json({ error: "sort must be featured, price_asc, or price_desc." });
    }

    const parsedLimit = limit === undefined ? undefined : Number(limit);
    if (parsedLimit !== undefined && (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100)) {
      return response.status(400).json({ error: "limit must be an integer from 1 to 100." });
    }

    const products = await Product.find(category ? { category } : {})
      .sort(buildSort(sort))
      .limit(parsedLimit ?? 0)
      .lean();

    return response.json(products.map((product) => serialiseProduct(product, getBaseUrl(request))));
  } catch (error) {
    return next(error);
  }
});

router.get("/:productId", async (request, response, next) => {
  try {
    const productId = Number(request.params.productId);
    if (!Number.isInteger(productId) || productId < 1) {
      return response.status(400).json({ error: "Product id must be a positive integer." });
    }

    const product = await Product.findOne({ productId }).lean();
    if (!product) return response.status(404).json({ error: "Product not found." });

    return response.json(serialiseProduct(product, getBaseUrl(request)));
  } catch (error) {
    return next(error);
  }
});

router.post("/", requireAuth, requireAdmin, async (request, response, next) => {
  try {
    const name = request.body.name?.trim();
    const category = request.body.category;
    const imageUrl = request.body.imageUrl?.trim();
    const newPrice = Number(request.body.newPrice);
    const oldPrice = Number(request.body.oldPrice);

    if (!name || name.length < 2 || name.length > 160 || !validCategories.has(category) || !isValidImageUrl(imageUrl)
      || !Number.isFinite(newPrice) || newPrice < 0 || !Number.isFinite(oldPrice) || oldPrice < newPrice) {
      return response.status(400).json({ error: "Enter a name, category, valid image URL, current price, and an original price equal to or higher than the current price." });
    }

    const latestProduct = await Product.findOne().sort({ productId: -1 }).select("productId").lean();
    const product = await Product.create({
      productId: (latestProduct?.productId ?? 0) + 1,
      name,
      category,
      imageFilename: "",
      imageUrl,
      newPrice,
      oldPrice,
    });
    return response.status(201).json({ product: serialiseProduct(product, getBaseUrl(request)) });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:productId", requireAuth, requireAdmin, async (request, response, next) => {
  try {
    const productId = Number(request.params.productId);
    const newPrice = Number(request.body.newPrice);
    const oldPrice = Number(request.body.oldPrice);
    if (!Number.isInteger(productId) || productId < 1 || !Number.isFinite(newPrice) || newPrice < 0
      || !Number.isFinite(oldPrice) || oldPrice < newPrice) {
      return response.status(400).json({ error: "Enter a valid current price and an original price equal to or higher than the current price." });
    }

    const product = await Product.findOneAndUpdate(
      { productId },
      { $set: { newPrice, oldPrice } },
      { new: true, runValidators: true },
    );
    if (!product) return response.status(404).json({ error: "Product not found." });
    return response.json({ product: serialiseProduct(product, getBaseUrl(request)) });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:productId", requireAuth, requireAdmin, async (request, response, next) => {
  try {
    const productId = Number(request.params.productId);
    if (!Number.isInteger(productId) || productId < 1) {
      return response.status(400).json({ error: "Product id must be a positive integer." });
    }

    const product = await Product.findOneAndDelete({ productId });
    if (!product) return response.status(404).json({ error: "Product not found." });
    return response.status(204).end();
  } catch (error) {
    return next(error);
  }
});

export default router;

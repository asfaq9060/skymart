import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.js";
import couponRoutes from "./routes/coupons.js";
import orderRoutes from "./routes/orders.js";
import productRoutes from "./routes/products.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const imageDirectory = path.resolve(
  currentDirectory,
  "../../frontend/src/components/Assets/Frontend_Assets",
);

const allowedOrigins = (process.env.FRONTEND_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/images", express.static(imageDirectory, { maxAge: "1d" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found." });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "An unexpected server error occurred." });
});

export default app;

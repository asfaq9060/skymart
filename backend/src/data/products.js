import { readFileSync } from "node:fs";

const catalogFile = new URL("./products.json", import.meta.url);

// This file is only a repeatable database seed. The running storefront reads
// products from MongoDB through the API, never from this local catalog file.
export const seedProducts = JSON.parse(readFileSync(catalogFile, "utf8"));

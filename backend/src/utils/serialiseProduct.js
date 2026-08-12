export function serialiseProduct(product, baseUrl) {
  return {
    id: product.productId,
    name: product.name,
    category: product.category,
    image: product.imageUrl || `${baseUrl}/images/${encodeURIComponent(product.imageFilename)}`,
    new_price: product.newPrice,
    old_price: product.oldPrice,
  };
}

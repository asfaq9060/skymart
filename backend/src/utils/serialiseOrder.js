export function serialiseOrder(order) {
  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: order.subtotal,
    discount: order.discount,
    total: order.total,
    couponCode: order.couponCode,
    items: order.items,
    createdAt: order.createdAt,
  };
}

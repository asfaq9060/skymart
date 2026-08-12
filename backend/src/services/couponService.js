import Coupon from "../models/Coupon.js";

export async function calculateCoupon(code, subtotal) {
  if (!code) return { coupon: null, discount: 0 };

  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() }).lean();
  if (!coupon || !coupon.active || (coupon.expiresAt && coupon.expiresAt < new Date())) {
    throw new Error("This coupon is not valid.");
  }
  if (subtotal < coupon.minOrderAmount) {
    throw new Error(`Spend ₹${coupon.minOrderAmount} or more to use ${coupon.code}.`);
  }

  let discount = coupon.type === "percentage"
    ? Math.round((subtotal * coupon.amount) / 100)
    : coupon.amount;
  if (coupon.maxDiscount !== null) discount = Math.min(discount, coupon.maxDiscount);

  return { coupon, discount: Math.min(discount, subtotal) };
}

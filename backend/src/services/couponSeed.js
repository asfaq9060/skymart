import Coupon from "../models/Coupon.js";

const coupons = [
  { code: "WELCOME10", type: "percentage", amount: 10, minOrderAmount: 999, maxDiscount: 500, active: true },
  { code: "SAVE200", type: "fixed", amount: 200, minOrderAmount: 1499, active: true },
];

export async function seedCoupons() {
  await Coupon.bulkWrite(
    coupons.map((coupon) => ({
      updateOne: { filter: { code: coupon.code }, update: { $set: coupon }, upsert: true },
    })),
  );
}

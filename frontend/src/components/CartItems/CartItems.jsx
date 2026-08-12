import { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./CartItems.module.css";
import { ShopContext } from "../../Context/ShopContext.js";
import { AuthContext } from "../../Context/AuthContext.js";
import { checkout, validateCoupon } from "../../services/checkout";
import removeIcon from "../Assets/Frontend_Assets/cart_cross_icon.png";
import CatalogueState from "../CatalogueState/CatalogueState";

function CartItems() {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart, clearCart, isLoadingProducts, productsError } = useContext(ShopContext);
  const { token, isAuthenticated } = useContext(AuthContext);
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  const subtotal = getTotalCartAmount();
  const items = useMemo(() => all_product.filter((product) => cartItems[product.id] > 0).map((product) => ({ productId: product.id, quantity: cartItems[product.id] })), [all_product, cartItems]);
  const activeCoupon = coupon?.subtotal === subtotal ? coupon : null;
  const discount = activeCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  if (isLoadingProducts || productsError) return <CatalogueState isLoading={isLoadingProducts} error={productsError} />;

  const handleCouponChange = (event) => {
    const nextCode = event.target.value.toUpperCase();
    setCouponCode(nextCode);
    if (coupon) {
      setCoupon(null);
      setCouponMessage(nextCode ? "Coupon removed. Apply the new code to update your total." : "Coupon removed. Your total has been restored.");
    } else setCouponMessage("");
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return setCouponMessage("Enter a coupon code first.");
    try {
      const result = await validateCoupon(couponCode, subtotal);
      setCoupon(result);
      setCouponCode(result.code ?? "");
      setCouponMessage(`${result.code} is applied. You saved ₹${result.discount}.`);
    } catch (error) {
      setCoupon(null);
      setCouponMessage(error.message);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponMessage("Coupon removed. Your total has been restored.");
  };

  const handleCheckout = async () => {
    setCheckoutMessage("");
    if (items.length === 0) return setCheckoutMessage("Your bag is empty.");
    if (!isAuthenticated) return navigate("/login", { state: { from: "/cart" } });
    setIsCheckingOut(true);
    try {
      const result = await checkout(items, activeCoupon?.code, token);
      clearCart();
      navigate(`/order-success/${result.order.id}`, { state: { order: result.order }, replace: true });
    } catch (error) {
      setCheckoutMessage(error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className={styles.cartitems}>
      <div className={styles["cartitems-format-main"]}><p>Products</p><p>Title</p><p>Price</p><p>Quantity</p><p>Total</p><p>Remove</p></div>
      <hr />
      {items.length ? all_product.map((product) => !cartItems[product.id] ? null : <div key={product.id}>
        <div className={`${styles["cartitems-format"]} ${styles["cartitems-format-main"]}`}>
          <Link to={`/product/${product.id}`} className={styles.productLink} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} className={styles["carticon-product-icon"]} /></Link>
          <p className={styles.title} data-label="Item">{product.name}</p><p data-label="Price">₹{product.new_price}</p>
          <span className={styles["cartitems-quantity"]} data-label="Quantity">{cartItems[product.id]}</span><p data-label="Total">₹{product.new_price * cartItems[product.id]}</p>
          <button type="button" className={styles["cartitems-remove-icon"]} aria-label={`Remove ${product.name} from your bag`} onClick={() => removeFromCart(product.id)}><img src={removeIcon} alt="" /></button>
        </div><hr />
      </div>) : <p className={styles["cartitems-empty"]}>Your cart is empty. Add something you love from the shop.</p>}
      <div className={styles["cartitems-down"]}>
        <div className={styles["cartitems-total"]}>
          <h1>Cart totals</h1><div>
            <div className={styles["cartitems-total-item"]}><p>Subtotal</p><p>₹{subtotal}</p></div><hr />
            {discount > 0 && <><div className={styles["cartitems-total-item"]}><p>Discount {activeCoupon.code}</p><p>-₹{discount}</p></div><hr /></>}
            <div className={styles["cartitems-total-item"]}><p>Shipping fee</p><p>Free</p></div><hr />
            <div className={styles["cartitems-total-item"]}><h3>Total</h3><h3>₹{total}</h3></div>
          </div>
          <button type="button" onClick={handleCheckout} disabled={isCheckingOut || items.length === 0}>{isCheckingOut ? "Placing your order…" : "Proceed to checkout"}</button>
          {checkoutMessage && <p className={styles.cartMessage} role="status">{checkoutMessage}</p>}
        </div>
        <div className={styles["cartitems-couponcode"]}>
          <p>Have a coupon? Try <strong>WELCOME10</strong> (10% off ₹999+) or <strong>SAVE200</strong> (₹200 off ₹1499+).</p>
          <div className={styles["cartitems-couponbox"]}><input value={couponCode} onChange={handleCouponChange} aria-label="Coupon code" placeholder="Coupon code" /><button type="button" onClick={handleApplyCoupon}>Apply</button></div>
          {coupon && activeCoupon && <div className={styles.appliedCoupon}><span><strong>{activeCoupon.code}</strong> applied — ₹{discount} discount</span><button type="button" onClick={removeCoupon}>Remove</button></div>}
          {couponMessage && <p className={styles.couponMessage} role="status">{couponMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default CartItems;

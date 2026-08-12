import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { fetchOrder } from "../services/checkout";
import styles from "./CSS/OrderSuccess.module.css";

function OrderSuccess() {
  const { orderId } = useParams();
  const location = useLocation();
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(location.state?.order ?? null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (order || !token) return;
    fetchOrder(orderId, token).then(({ order: savedOrder }) => setOrder(savedOrder)).catch((requestError) => setError(requestError.message));
  }, [order, orderId, token]);

  if (error) return <section className={styles.state}><h1>We couldn’t find that order</h1><p>{error}</p><Link to="/">Continue shopping</Link></section>;
  if (!order) return <section className={styles.state}><p>Loading your order…</p></section>;

  return (
    <section className={styles.success}>
      <div className={styles.checkmark} aria-hidden="true">✓</div>
      <p className={styles.eyebrow}>ORDER CONFIRMED</p>
      <h1>Your order was placed successfully.</h1>
      <p>Thank you for shopping with SKY Mart. We’ll begin preparing your order right away.</p>
      <div className={styles.summary}>
        <p><span>Order number</span><strong>{order.orderNumber}</strong></p>
        <p><span>Items</span><strong>{order.items.reduce((quantity, item) => quantity + item.quantity, 0)}</strong></p>
        {order.couponCode && <p><span>Coupon</span><strong>{order.couponCode}</strong></p>}
        <p><span>Amount paid</span><strong>₹{order.total}</strong></p>
      </div>
      <Link className={styles.button} to="/">Continue shopping</Link>
    </section>
  );
}

export default OrderSuccess;

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { fetchOrders } from "../services/checkout";
import styles from "./CSS/Account.module.css";

function Account() {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;
    fetchOrders(token)
      .then(({ orders: savedOrders }) => setOrders(savedOrders))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, [token]);

  if (!user) {
    return <section className={styles.guest}><h1>Your account</h1><p>Log in to view your profile and orders.</p><Link to="/login" state={{ from: "/account" }}>Log in</Link></section>;
  }

  return (
    <section className={styles.account}>
      <p className={styles.eyebrow}>MY ACCOUNT</p>
      <h1>Hi, {user.name}</h1>
      <div className={styles.profile}><span>Email address</span><strong>{user.email}</strong></div>
      <h2>Order history</h2>
      {isLoading && <p>Loading your orders…</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {!isLoading && !error && orders.length === 0 && <p className={styles.empty}>You have no orders yet. <Link to="/">Start shopping</Link></p>}
      <div className={styles.orders}>
        {orders.map((order) => (
          <article className={styles.order} key={order.id}>
            <div><span>Order</span><strong>{order.orderNumber}</strong></div>
            <div><span>Placed</span><strong>{new Date(order.createdAt).toLocaleDateString()}</strong></div>
            <div><span>Items</span><strong>{order.items.reduce((total, item) => total + item.quantity, 0)}</strong></div>
            <div><span>Total</span><strong>₹{order.total}</strong></div>
            <div><span>Status</span><strong className={styles.status}>{order.status}</strong></div>
            <Link to={`/order-success/${order.id}`}>View order</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Account;

import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { ShopContext } from "../Context/ShopContext";
import { createProduct } from "../services/products";
import styles from "./CSS/Admin.module.css";

const initialForm = { name: "", category: "women", imageUrl: "", newPrice: "", oldPrice: "" };

function Admin() {
  const { user, token } = useContext(AuthContext);
  const { addProductToCatalogue } = useContext(ShopContext);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <section className={styles.access}><h1>Administrator access</h1><p>Log in with an administrator account to add products.</p><Link to="/login" state={{ from: "/admin" }}>Log in</Link></section>;
  }
  if (user.role !== "admin") {
    return <section className={styles.access}><h1>Administrator access</h1><p>Your account does not have permission to add products.</p><Link to="/">Return to shop</Link></section>;
  }

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submitProduct = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      const result = await createProduct(form, token);
      addProductToCatalogue(result.product);
      setForm(initialForm);
      setMessage(`${result.product.name} was added to the catalogue.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.admin}>
      <p className={styles.eyebrow}>ADMINISTRATION</p>
      <h1>Add a product</h1>
      <p className={styles.intro}>Edit and Delete controls appear below every product card while you are logged in as an administrator.</p>
      <form className={styles.form} onSubmit={submitProduct}>
        <label>Product name<input name="name" value={form.name} onChange={updateField} minLength="2" maxLength="160" required /></label>
        <label>Category<select name="category" value={form.category} onChange={updateField}><option value="women">Women</option><option value="men">Men</option><option value="kid">Kids</option></select></label>
        <label>Image URL<input name="imageUrl" type="url" value={form.imageUrl} onChange={updateField} placeholder="https://example.com/product.jpg" required /></label>
        <div className={styles.priceGrid}><label>Current price (&#8377;)<input name="newPrice" type="number" min="0" step="0.01" value={form.newPrice} onChange={updateField} required /></label><label>Original price (&#8377;)<input name="oldPrice" type="number" min="0" step="0.01" value={form.oldPrice} onChange={updateField} required /></label></div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {message && <p className={styles.message} role="status">{message}</p>}
        <button disabled={isSubmitting}>{isSubmitting ? "Adding product..." : "Add product"}</button>
      </form>
    </section>
  );
}

export default Admin;

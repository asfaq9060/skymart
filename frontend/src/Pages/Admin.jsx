import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { ShopContext } from "../Context/ShopContext";
import { createProduct, deleteProduct, updateProductPrice } from "../services/products";
import styles from "./CSS/Admin.module.css";

const initialForm = { name: "", category: "women", imageUrl: "", newPrice: "", oldPrice: "" };

function ProductPriceRow({ product, token, onPriceUpdated, onProductDeleted }) {
  const [newPrice, setNewPrice] = useState(product.new_price);
  const [oldPrice, setOldPrice] = useState(product.old_price);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const savePrices = async () => {
    setError("");
    setIsSaving(true);
    try {
      const result = await updateProductPrice(product.id, { newPrice, oldPrice }, token);
      onPriceUpdated(result.product);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const removeProduct = async () => {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    setError("");
    setIsDeleting(true);
    try {
      await deleteProduct(product.id, token);
      onProductDeleted(product.id);
    } catch (requestError) {
      setError(requestError.message);
      setIsDeleting(false);
    }
  };

  return (
    <article className={styles.product}>
      <img src={product.image} alt={product.name} />
      <div className={styles.productInfo}><strong>{product.name}</strong><span>{product.category === "kid" ? "Kids" : product.category}</span></div>
      <label>Current price (₹)<input type="number" min="0" step="0.01" value={newPrice} onChange={(event) => setNewPrice(event.target.value)} /></label>
      <label>Original price (₹)<input type="number" min="0" step="0.01" value={oldPrice} onChange={(event) => setOldPrice(event.target.value)} /></label>
      <div className={styles.rowActions}><button type="button" onClick={savePrices} disabled={isSaving || isDeleting}>{isSaving ? "Saving…" : "Save"}</button><button type="button" className={styles.deleteButton} onClick={removeProduct} disabled={isSaving || isDeleting}>{isDeleting ? "Deleting…" : "Delete"}</button></div>
      {error && <p className={styles.rowError} role="alert">{error}</p>}
    </article>
  );
}

function Admin() {
  const { user, token } = useContext(AuthContext);
  const { all_product, addProductToCatalogue, updateProductInCatalogue, removeProductFromCatalogue, isLoadingProducts } = useContext(ShopContext);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <section className={styles.access}><h1>Administrator access</h1><p>Log in with an administrator account to manage products.</p><Link to="/login" state={{ from: "/admin" }}>Log in</Link></section>;
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
      <p className={styles.intro}>Only administrators can add, update, or delete products. Changes are immediately available in the store.</p>
      <form className={styles.form} onSubmit={submitProduct}>
        <label>Product name<input name="name" value={form.name} onChange={updateField} minLength="2" maxLength="160" required /></label>
        <label>Category<select name="category" value={form.category} onChange={updateField}><option value="women">Women</option><option value="men">Men</option><option value="kid">Kids</option></select></label>
        <label>Image URL<input name="imageUrl" type="url" value={form.imageUrl} onChange={updateField} placeholder="https://example.com/product.jpg" required /></label>
        <div className={styles.priceGrid}><label>Current price (₹)<input name="newPrice" type="number" min="0" step="0.01" value={form.newPrice} onChange={updateField} required /></label><label>Original price (₹)<input name="oldPrice" type="number" min="0" step="0.01" value={form.oldPrice} onChange={updateField} required /></label></div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {message && <p className={styles.message} role="status">{message}</p>}
        <button disabled={isSubmitting}>{isSubmitting ? "Adding product…" : "Add product"}</button>
      </form>
      <section className={styles.catalogue}>
        <h2>Manage products</h2>
        {isLoadingProducts ? <p>Loading products…</p> : <div className={styles.productList}>{all_product.map((product) => <ProductPriceRow key={product.id} product={product} token={token} onPriceUpdated={updateProductInCatalogue} onProductDeleted={removeProductFromCatalogue} />)}</div>}
      </section>
    </section>
  );
}

export default Admin;

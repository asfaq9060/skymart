import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ShopContext } from "../../Context/ShopContext";
import { deleteProduct, updateProductPrice } from "../../services/products";
import styles from "./AdminProductActions.module.css";

function AdminProductActions({ product }) {
  const { user, token } = useContext(AuthContext);
  const { updateProductInCatalogue, removeProductFromCatalogue } = useContext(ShopContext);
  const [newPrice, setNewPrice] = useState(product.new_price);
  const [oldPrice, setOldPrice] = useState(product.old_price);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setNewPrice(product.new_price);
    setOldPrice(product.old_price);
  }, [product.new_price, product.old_price]);

  if (user?.role !== "admin") return null;

  const cancelEditing = () => {
    setNewPrice(product.new_price);
    setOldPrice(product.old_price);
    setError("");
    setIsEditing(false);
  };

  const savePrices = async () => {
    setError("");
    setIsSaving(true);
    try {
      const result = await updateProductPrice(product.id, { newPrice, oldPrice }, token);
      updateProductInCatalogue(result.product);
      setIsEditing(false);
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
      removeProductFromCatalogue(product.id);
    } catch (requestError) {
      setError(requestError.message);
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.actions}>
      {isEditing && <div className={styles.priceFields}>
        <label>Current price<input type="number" min="0" step="0.01" value={newPrice} onChange={(event) => setNewPrice(event.target.value)} /></label>
        <label>Original price<input type="number" min="0" step="0.01" value={oldPrice} onChange={(event) => setOldPrice(event.target.value)} /></label>
      </div>}
      <div className={styles.buttons}>
        {isEditing ? <>
          <button type="button" onClick={savePrices} disabled={isSaving || isDeleting}>{isSaving ? "Saving..." : "Save"}</button>
          <button type="button" className={styles.cancelButton} onClick={cancelEditing} disabled={isSaving || isDeleting}>Cancel</button>
        </> : <button type="button" onClick={() => { setError(""); setIsEditing(true); }} disabled={isDeleting}>Edit</button>}
        <button type="button" className={styles.deleteButton} onClick={removeProduct} disabled={isSaving || isDeleting}>{isDeleting ? "Deleting..." : "Delete"}</button>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}

export default AdminProductActions;

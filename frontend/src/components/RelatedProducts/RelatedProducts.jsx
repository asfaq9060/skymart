import { useContext } from "react";
import styles from './RelatedProducts.module.css'
import Item from '../Item/Item'
import { ShopContext } from "../../Context/ShopContext";

function RelatedProducts({ category, productId }) {
  const { all_product } = useContext(ShopContext);
  const products = all_product
    .filter((product) => product.category === category && product.id !== productId)
    .slice(0, 4);

  if (products.length === 0) return null;

  return (
    <div className={styles["relatedproducts"]}>
      <h1>Related Products</h1>
      <hr />
      <div className={styles["relatedproducts-item"]}>
        {products.map((item) => <Item key={item.id} {...item} />)}
      </div>
    </div>
  )
}

export default RelatedProducts

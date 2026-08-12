import React, { useContext } from 'react'
import styles from './CSS/ShopCategory.module.css';
import { ShopContext } from '../Context/ShopContext.js'
import dropdown_icon from '../components/Assets/Frontend_Assets/dropdown_icon.png'
import Item from '../components/Item/Item.jsx'
import CatalogueState from '../components/CatalogueState/CatalogueState.jsx';

function ShopCategory({ banner, category }) {
  const { all_product, isLoadingProducts, productsError } = useContext(ShopContext);
  const products = all_product.filter((item) => category === item.category);
  if (isLoadingProducts || productsError) {
    return <CatalogueState isLoading={isLoadingProducts} error={productsError} />;
  }
  return (
    <div className={styles["shop-category"]}> 
      <img className={styles["shopcategory-banner"]} src={banner} alt={`${category} collection`} />
      <div className={styles["shopcategory-indexSort"]}>
        <p>
          <span>Showing {products.length}</span> styles in this collection
        </p>
        <label className={styles["shopcateogry-sort"]}>Sort by
          <select aria-label="Sort products">
            <option>Featured</option>
            <option>Price: low to high</option>
            <option>Price: high to low</option>
          </select>
          <img src={dropdown_icon} alt="" />
        </label>
      </div>
      <div className={styles["shopcategory-products"]}>
        {products.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </div>
      <button type="button" className={styles["shopcategory-loadmore"]}>
        Explore more
      </button>
    </div>
  )
}

export default ShopCategory

import styles from "./ProductDisplay.module.css";
import star_icon from "../Assets/Frontend_Assets/star_icon.png";
import star_dull_icon from "../Assets/Frontend_Assets/star_dull_icon.png";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext.js";

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState("M");
  const [wasAdded, setWasAdded] = useState(false);
  const category = product.category === "kid" ? "Kids" : `${product.category[0].toUpperCase()}${product.category.slice(1)}`;

  useEffect(() => {
    setWasAdded(false);
  }, [product.id, selectedSize]);

  const handleAddToCart = () => {
    addToCart(product.id);
    setWasAdded(true);
  };

  return (
    <div className={styles.productdisplay}>
      <div className={styles["productdisplay-left"]}>
        <div className={styles["productdisplay-img-list"]}>
          <img src={product.image} alt={`${product.name} thumbnail`} />
          <img src={product.image} alt={`${product.name} thumbnail`} />
          <img src={product.image} alt={`${product.name} thumbnail`} />
          <img src={product.image} alt={`${product.name} thumbnail`} />
        </div>
        <div className={styles["productdisplay-img"]}>
          <img
            className={styles["productdisplay-main-img"]}
            src={product.image}
            alt={product.name}
          />
        </div>
      </div>
      <div className={styles["productdisplay-right"]}>
        <h1>{product.name}</h1>
        <div className={styles["productdisplay-right-star"]}>
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>{122}</p>
        </div>
        <div className={styles["productdisplay-right-prices"]}>
          <div className={styles["productdisplay-right-prices-old"]}>
            &#8377;{product.old_price}
          </div>
          <div className={styles["productdisplay-right-prices-new"]}>
            &#8377;{product.new_price}
          </div>
          <div className={styles["productdisplay-right-description"]}>
            {product.name} is a stylish {category.toLowerCase()} fashion piece
            designed for everyday comfort and a great fit.
          </div>
          <div className={styles["productdisplay-right-size"]}>
            <h1>Select Size</h1>
            <div className={styles["productdisplay-right-sizes"]}>
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <button
                  className={selectedSize === size ? styles.selected : ""}
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
        {wasAdded ? (
          <Link className={styles["display-button"]} to="/cart">GO TO CART</Link>
        ) : (
          <button className={styles["display-button"]} onClick={handleAddToCart}>ADD TO CART</button>
        )}
        <p className={styles["productdisplay-right-category"]}>
          <span>Category: </span>
          {category}
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;

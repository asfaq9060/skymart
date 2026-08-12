import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext.js";
import NewsLetter from "../components/NewsLetter/NewsLetter";
import heroImage from "../components/Assets/Frontend_Assets/hero_image.png";
import styles from "./CSS/Shop.module.css";
import CatalogueState from "../components/CatalogueState/CatalogueState";

const categoryCards = [
  { id: "women", label: "Women", description: "Everyday styles, made special" },
  { id: "men", label: "Men", description: "Effortless pieces for every plan" },
  { id: "kid", label: "Kids", description: "Play-ready favourites" },
];

function Shop() {
  const { all_product, addToCart, isLoadingProducts, productsError } = useContext(ShopContext);
  const [activeCategory, setActiveCategory] = useState("all");
  const [addedProductIds, setAddedProductIds] = useState([]);

  const featuredProducts = useMemo(() => {
    const products = activeCategory === "all" ? all_product : all_product.filter((product) => product.category === activeCategory);
    return products.slice(0, 8);
  }, [activeCategory, all_product]);
  const collectionCount = new Set(all_product.map((product) => product.category)).size;
  const getCategoryProduct = (category) => all_product.find((product) => product.category === category);
  const handleAddToCart = (productId) => {
    addToCart(productId);
    setAddedProductIds((current) => [...new Set([...current, productId])]);
  };

  if (isLoadingProducts || productsError) return <CatalogueState isLoading={isLoadingProducts} error={productsError} />;

  return (
    <div className={styles.shop}>
      <p className={styles.announcement}>Free shipping on every order · New season is here</p>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>THE NEW EDIT</p>
          <h1>Everyday style,<br /><em>made effortless.</em></h1>
          <p className={styles.heroCopy}>Fresh essentials and stand-out favourites for every version of your day.</p>
          <div className={styles.heroActions}>
            <Link to="/womens" className={styles.primaryButton}>Shop women</Link>
            <Link to="/mens" className={styles.textButton}>Shop men <span aria-hidden="true">→</span></Link>
          </div>
          <div className={styles.heroStats}>
            <div><strong>{all_product.length}</strong><span>handpicked styles</span></div>
            <div><strong>{collectionCount}</strong><span>collections to explore</span></div>
          </div>
        </div>
        <div className={styles.heroVisual}><div className={styles.heroBadge}>NEW<br />SEASON</div><img src={heroImage} alt="Model wearing a new-season outfit" /></div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>SHOP YOUR WAY</p><h2>Find your next favourite</h2></div><p>Browse a small, considered collection made for real life.</p></div>
        <div className={styles.categoryGrid}>
          {categoryCards.map((category) => {
            const product = getCategoryProduct(category.id);
            return <Link key={category.id} to={`/${category.id === "kid" ? "kids" : `${category.id}s`}`} className={styles.categoryCard}>
              <img src={product.image} alt="" /><div className={styles.categoryOverlay}><p>{category.description}</p><h3>{category.label} <span aria-hidden="true">→</span></h3></div>
            </Link>;
          })}
        </div>
      </section>

      <section className={`${styles.section} ${styles.featuredSection}`}>
        <div className={styles.featuredTopline}><div><p className={styles.eyebrow}>TRENDING NOW</p><h2>Just landed</h2></div><Link to="/womens" className={styles.textButton}>View all <span aria-hidden="true">→</span></Link></div>
        <div className={styles.filterBar} aria-label="Filter products by collection">
          {[["all", "All styles"], ["women", "Women"], ["men", "Men"], ["kid", "Kids"]].map(([category, label]) => <button key={category} className={activeCategory === category ? styles.activeFilter : ""} type="button" onClick={() => setActiveCategory(category)}>{label}</button>)}
        </div>
        <div className={styles.productGrid}>
          {featuredProducts.map((product) => <article className={styles.productCard} key={product.id}>
            <Link to={`/product/${product.id}`} className={styles.productImage}><img src={product.image} alt={product.name} /><span>Quick view</span></Link>
            <div className={styles.productDetails}><p className={styles.productCategory}>{product.category === "kid" ? "Kids" : product.category}</p><Link to={`/product/${product.id}`}>{product.name}</Link>
              <div className={styles.productMeta}><p><strong>₹{product.new_price}</strong> <s>₹{product.old_price}</s></p>{addedProductIds.includes(product.id) ? <Link to="/cart">Go to cart</Link> : <button type="button" onClick={() => handleAddToCart(product.id)}>Add to cart</button>}</div>
            </div>
          </article>)}
        </div>
      </section>
      <section className={styles.promiseBar} aria-label="Shopping benefits"><div><span>01</span><p><strong>Easy to browse</strong>Clear collections, no clutter.</p></div><div><span>02</span><p><strong>Curated edits</strong>Only the pieces worth seeing.</p></div><div><span>03</span><p><strong>Ready for you</strong>Your bag stays saved as you shop.</p></div></section>
      <NewsLetter />
    </div>
  );
}

export default Shop;

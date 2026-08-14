import { Link } from "react-router-dom";
import AdminProductActions from "../AdminProductActions/AdminProductActions";
import styles from "./Item.module.css";


const Item = (props) => {
  return (
    <div className={styles.item}>
      <Link to={`/product/${props.id}`}>
        <img onClick={() => window.scrollTo(0, 0)} src={props.image} alt={props.name} />
      </Link>
      <Link to={`/product/${props.id}`} className={styles["item-name"]}>
        <p>{props.name}</p>
      </Link>
      <div className={styles['item-prices']}>
        <div className={styles['item-price-new']}>
          &#8377;{props.new_price}
        </div>
        <div className={styles['item-price-old']}>
         &#8377;{props.old_price}
        </div>
      </div>
      <AdminProductActions product={props} />
    </div>
  )
}

export default Item

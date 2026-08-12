import styles from './Popular.module.css'
import { useContext } from 'react'
import Item from '../Item/Item'
import { ShopContext } from '../../Context/ShopContext'

function Popular() {
  const { all_product } = useContext(ShopContext);
  const products = all_product.filter((product) => product.category === "women").slice(0, 4);
  return (
    <div className={styles.popular}>
      <h1>POPULAR IN WOMEN</h1>
      <hr/>
      <div className={styles['popular-item']}>
        {products.map((item) => <Item key={item.id} {...item} />)}
      </div>
    </div>
  )
}

export default Popular

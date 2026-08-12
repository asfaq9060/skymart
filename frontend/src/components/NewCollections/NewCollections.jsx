import styles from './NewCollections.module.css'
import { useContext } from 'react'
import Item from '../Item/Item'
import { ShopContext } from '../../Context/ShopContext'

const NewCollections = () => {
  const { all_product } = useContext(ShopContext);
  const products = all_product.slice(0, 8);
  return (
    <div className={styles['new-collections']}>
      <h1>NEW COLLECTIONS</h1>
      <hr/>
      <div className={styles.collections}>
        {products.map((item) => <Item key={item.id} {...item} />)}
      </div>
    </div>
  )
}

export default NewCollections

import styles from './Offers.module.css'
import React from 'react'
import exclusive_image from '../Assets/Frontend_Assets/exclusive_image.png'
import { Link } from 'react-router-dom'

function Offers() {
  return (
    <div className={styles.offers}>
      <div className={styles['offers-left']}>
        <h1>Exclusive</h1>
        <h1>Offers For You</h1>
        <p>ONLY ON BEST SELLER PRODUCTS</p>
        <Link to="/womens"><button type="button">Check Now</button></Link>
      </div>
      <div className={styles['offers-right']}>
        <img src={exclusive_image} alt="" />
      </div>
    </div>
  )
}

export default Offers

import { Link } from "react-router-dom";
import styles from "./Hero.module.css";
import hand_icon from "../Assets/Frontend_Assets/hand_icon.png";
import arrow_icon from "../Assets/Frontend_Assets/arrow.png";
import hero_image from "../Assets/Frontend_Assets/hero_image.png";
function Hero() {
  return (
    <div className={styles.hero_container}>
      <div className={styles.hero_left}>
        <h2>NEW ARRIVALS ONLY</h2>

        <div className={styles.hero_text_group}>
          <div className={styles.hero_hand_icon}>
            <p>new</p>
            <img src={hand_icon} alt="" />
          </div>
          <p className={styles.hero_text}>collections</p>
          <p className={styles.hero_text}>for everyone</p>
        </div>

        <Link to="/womens" className={styles.hero_latest_btn}>
          <div>Latest Collection</div>
          <img src={arrow_icon} alt="" />
        </Link>
      </div>

      <div className={styles.hero_right}>
        <img src={hero_image} alt="" />
      </div>
    </div>
  );
}

export default Hero;

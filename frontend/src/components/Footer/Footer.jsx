import styles from "./Footer.module.css";
import footer_logo from "../Assets/Frontend_Assets/logo_big.png";
import instagram_icon from "../Assets/Frontend_Assets/instagram_icon.png";
import pintester_icon from "../Assets/Frontend_Assets/pintester_icon.png";
import whatsapp_icon from "../Assets/Frontend_Assets/whatsapp_icon.png";

function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className={styles.footer}>
      <button
        type="button"
        className={styles["footer-logo"]}
        onClick={scrollToTop}
        aria-label="Back to the top of the shop page"
      >
        <img src={footer_logo} alt="" />
        <p>SKY Mart</p>
      </button>
      <ul className={styles["footer-links"]}>
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className={styles["footer-social-icon"]}>
        <a
          className={styles["footer-icons-container"]}
          href="https://www.instagram.com/md_asfaq07/"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit SKY Mart on Instagram"
        >
          <img src={instagram_icon} alt="" />
        </a>
        <a
          className={styles["footer-icons-container"]}
          href="https://in.pinterest.com/asfaq9060"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit SKY Mart on Pintrest"
        >
          <img src={pintester_icon} alt="" />
        </a>
        <a
          className={styles["footer-icons-container"]}
          href="https://wa.me/"
          target="_blank"
          rel="noreferrer"
          aria-label="Contact SKY Mart on WhatsApp"
        >
          <img src={whatsapp_icon} alt="" />
        </a>
      </div>
      <div className={styles["footer-copyright"]}>
        <hr />
        <p>
          Copyright © 2026 <b>Sky Ma</b>rt All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;

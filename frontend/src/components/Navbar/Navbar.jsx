import styles from "./Navbar.module.css";
import logo from "../Assets/Frontend_Assets/logo.png";
import cart from "../Assets/Frontend_Assets/cart_icon.png";
import { useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext.js";
import { AuthContext } from "../../Context/AuthContext.js";
import nav_dropdown from "../Assets/Frontend_Assets/nav_dropdown.png";

function Navbar() {
  const { getTotalCartItems } = useContext(ShopContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const handleSectionClick = (event, path) => {
    closeMenu();
    if (location.pathname === path) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <div className={styles.navbar}>
      <Link to="/" className={styles.nav_logo} onClick={(event) => handleSectionClick(event, "/")}>
        <img src={logo} alt="logo-img" />
        <p>SKY Mart</p>
      </Link>
      <div className={styles.nav_items}>
        <button
          className={styles["nav-dropdown"]}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          aria-label="Toggle navigation menu"
          type="button"
        >
          <img src={nav_dropdown} alt="" />
        </button>
        <ul id="primary-navigation" className={`${styles.nav_items_list} ${isMenuOpen ? styles["nav-menu-visible"] : ""}`}>
          <li>
            <NavLink onClick={(event) => handleSectionClick(event, "/")} to="/" end>
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink onClick={(event) => handleSectionClick(event, "/mens")} to="/mens">
              Men
            </NavLink>
          </li>
          <li>
            <NavLink onClick={(event) => handleSectionClick(event, "/womens")} to="/womens">
              Women
            </NavLink>
          </li>
          <li>
            <NavLink onClick={(event) => handleSectionClick(event, "/kids")} to="/kids">
              Kids
            </NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.nav_cart}>
        {user ? (
          <>
            <Link className={styles.accountLink} to="/account">Account</Link>
            {user.role === "admin" && <Link className={styles.accountLink} to="/admin" onClick={(event) => {
              if (location.pathname === "/admin") {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}>Admin</Link>}
            <button className={styles["nav_login_cart"]} type="button" onClick={logout} title={`Signed in as ${user.email}`}>Log out</button>
          </>
        ) : (
          <Link to="/login">
            <button className={styles["nav_login_cart"]}>Login</button>
          </Link>
        )}
        <Link to="/cart">
          <img src={cart} alt="Shopping bag" />
        </Link>
        <div className={styles.nav_cart_count}>{getTotalCartItems()}</div>
      </div>
    </div>
  );
}
export default Navbar;

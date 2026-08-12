import styles from "./DescriptionBox.module.css";
import { useState } from "react";

function DescriptionBox() {
  const [activeTab, setActiveTab] = useState("description");
  return (
    <div className={styles.descriptionBox}>
      <div className={styles["descriptionbox-navigator"]}>
        <button type="button" onClick={() => setActiveTab("description")} className={`${styles["descriptionbox-nav-box"]} ${activeTab === "description" ? styles.fade : ""}`}>Description</button>
        <button type="button" onClick={() => setActiveTab("reviews")} className={`${styles["descriptionbox-nav-box"]} ${activeTab === "reviews" ? styles.fade : ""}`}>Reviews (122)</button>
      </div>
      <div className={styles["descriptionbox-description"]}>
        {activeTab === "description" ? <><p>
          An e-commerce website is a platform that facilitates online buying and
          selling of products or services. It allows users to browse catalogs,
          compare prices, place orders, make secure payments, and track
          deliveries. These websites provide convenience, wide selection, and
          seamless shopping experiences for customers worldwide.
        </p><p>
          E-commerce websites showcase products or services online, enabling
          users to browse, compare, purchase, and track orders conveniently from
          any device, anytime, anywhere.
        </p></> : <p>Reviews will be available soon. We’re gathering feedback from verified SKY Mart customers.</p>}
      </div>
    </div>
  );
}

export default DescriptionBox;

import styles from "./CatalogueState.module.css";

function CatalogueState({ isLoading, error }) {
  if (isLoading) {
    return <p className={styles.state} role="status">Loading the catalogue…</p>;
  }

  if (error) {
    return <p className={styles.state} role="alert">{error}</p>;
  }

  return null;
}

export default CatalogueState;

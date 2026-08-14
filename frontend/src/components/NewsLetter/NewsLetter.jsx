import { useState } from "react";
import { subscribeToNewsletter } from "../../services/newsletter";
import styles from "./NewsLetter.module.css";

function NewsLetter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsSubmitting(true);
    try {
      const result = await subscribeToNewsletter(email);
      setMessage(result.message);
      setEmail("");
    } catch (requestError) {
      setMessage(requestError.message);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.newsletter}>
      <p className={styles.eyebrow}>STAY IN THE LOOP</p>
      <h1>Good things, straight to your inbox.</h1>
      <p>New arrivals, thoughtful edits and a little something extra.</p>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" aria-label="Email address" placeholder="Email address" autoComplete="email" disabled={isSubmitting} required />
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Subscribing..." : "Subscribe"}</button>
      </form>
      <p className={`${styles.message} ${isError ? styles.error : ""}`} aria-live="polite">{message}</p>
    </section>
  );
}

export default NewsLetter;

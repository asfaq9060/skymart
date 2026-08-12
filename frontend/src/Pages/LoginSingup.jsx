import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import styles from "./CSS/LoginSignUp.module.css";

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from ?? "/";

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!isLogin && !acceptedTerms) {
      setError("Please accept the terms to create your account.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) await login({ email: form.email, password: form.password });
      else await register(form);
      navigate(returnTo, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((current) => !current);
    setError("");
  };

  return (
    <div className={styles.loginsignup}>
      <form className={styles["loginsignup-container"]} onSubmit={handleSubmit}>
        <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
        <div className={styles["loginsignup-fields"]}>
          {!isLogin && <input name="name" type="text" placeholder="Your name" value={form.name} onChange={updateField} autoComplete="name" required />}
          <input name="email" type="email" placeholder="Email address" value={form.email} onChange={updateField} autoComplete="email" required />
          <input name="password" type="password" placeholder="Password (8+ characters)" value={form.password} onChange={updateField} autoComplete={isLogin ? "current-password" : "new-password"} minLength="8" required />
        </div>
        {error && <p className={styles.formError} role="alert">{error}</p>}
        <button className={styles["signup-btn"]} disabled={isSubmitting}>
          {isSubmitting ? "Please wait…" : isLogin ? "Log in" : "Create account"}
        </button>
        <p className={styles["loginsignup-login"]}>
          {isLogin ? "New to SKY Mart? " : "Already have an account? "}
          <button type="button" className={styles.modeButton} onClick={toggleMode}>{isLogin ? "Create an account" : "Log in"}</button>
        </p>
        {!isLogin && (
          <label className={styles["loginsignup-agree"]}>
            <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
            <span>By continuing, I agree to the terms of use and privacy policy.</span>
          </label>
        )}
      </form>
    </div>
  );
}

export default LoginSignup;

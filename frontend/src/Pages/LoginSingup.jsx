import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import styles from "./CSS/LoginSignUp.module.css";

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from ?? "/";

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!isLogin && !acceptedTerms) {
      setError("Please accept the terms to create your account.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
        navigate(returnTo, { replace: true });
      } else {
        await register(form);
        setIsLogin(true);
        setForm((current) => ({ ...current, name: "" }));
        setAcceptedTerms(false);
        setMessage("Account created successfully! Please log in.");
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((current) => !current);
    setError("");
    setMessage("");
  };

  return (
    <div className={styles.loginsignup}>
      <form className={styles["loginsignup-container"]} onSubmit={handleSubmit}>
        <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
        <div className={styles["loginsignup-fields"]}>
          {!isLogin && <input name="name" type="text" placeholder="Your name" value={form.name} onChange={updateField} autoComplete="name" required />}
          <input name="email" type="email" placeholder="Email address" value={form.email} onChange={updateField} autoComplete="email" required />
          <div className={styles.passwordWrapper}>
            <input name="password" type={showPassword ? "text" : "password"} placeholder="Password (8+ characters)" value={form.password} onChange={updateField} autoComplete={isLogin ? "current-password" : "new-password"} minLength="8" required />
            <button type="button" className={styles.eyeToggle} onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              )}
            </button>
          </div>
        </div>
        {message && <p className={styles.formMessage} role="status">{message}</p>}
        {error && <p className={styles.formError} role="alert">{error}</p>}
        <button className={styles["signup-btn"]} disabled={isSubmitting}>{isSubmitting ? "Please wait..." : isLogin ? "Log in" : "Create account"}</button>
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

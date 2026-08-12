import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section style={{ minHeight: "55vh", padding: "100px 20px", textAlign: "center" }}>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/">Go to the shop</Link>
    </section>
  );
}

export default NotFound;

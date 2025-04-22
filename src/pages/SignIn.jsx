import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../partials/components/LoadingSpinner";

export default function SignIn() {
  const { signIn, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRemember] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Auth state changed:", { isAuthenticated });
    if (isAuthenticated) {
      console.log("User is authenticated, navigating to projects");
      navigate("/admin/projects");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting sign in with:", { email, rememberMe });
    setError(null);
    try {
      await signIn({ email, password, rememberMe });
      console.log("Sign in successful, navigating to projects");
      navigate("/admin/projects");
    } catch (error) {
      console.error("Sign in error:", error);
      setError(error.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section id="signin">
      <div className="content">
        <section className="section-header">
          <h2>Sign In</h2>
        </section>

        <section className="section-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="field-group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="field-group">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
            </div>

            <div className="form-group error-container">
              {error && <div className="field-validation-error">{error}</div>}
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="btn btn-submit btn-signin"
                disabled={loading}>
                <span>{loading ? "Signing In..." : "Sign In"}</span>
              </button>
            </div>
          </form>
        </section>

        <section className="section-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </section>
      </div>
    </section>
  );
}

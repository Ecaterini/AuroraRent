import { useState } from "react";
import "../App.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail === "manager@aurorarent.com" &&
      password === "manager123"
    ) {
      setError("");
      onLogin("manager");
    } else if (
      normalizedEmail === "guest@aurorarent.com" &&
      password === "guest123"
    ) {
      setError("");
      onLogin("guest");
    } else if (
      normalizedEmail === "leader@aurorarent.com" &&
      password === "leader123"
    ) {
      setError("");
      onLogin("leader");
    } else {
      setError("Невірна електронна пошта або пароль");
    }
  };

  return (
    <main className="login-page">
      <div className="aurora aurora-one"></div>
      <div className="aurora aurora-two"></div>
      <div className="aurora aurora-three"></div>

      <div className="login-container">
        <div className="login-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 48 48" fill="none">
              <path
                d="M8 33L17 12L24 27L31 16L40 33"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 38H36"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1>AuroraRent</h1>
          <p>Система управління орендою обладнання</p>
        </div>

        <section className="login-card">
          <div className="login-heading">
            <span className="login-label">ВІТАЄМО ЗНОВУ</span>
            <h2>Вхід до системи</h2>
            <p>Увійдіть до свого облікового запису</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Електронна пошта</label>

              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M4 7L12 13L20 7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>

              <div className="input-wrapper">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <path
                    d="M8 10V7A4 4 0 0116 7V10"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  type="password"
                  id="password"
                  placeholder="Введіть пароль"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" />
                <span>Запам'ятати мене</span>
              </label>

              <span className="forgot-password">
                Забули пароль?
              </span>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-button">
              Увійти до системи
              <span>→</span>
            </button>
          </form>

          <div className="login-footer">
            <span className="footer-dot"></span>
            Безпечний доступ до системи
          </div>
        </section>

        <div className="login-bottom">
          © 2026 AuroraRent. Усі права захищені.
        </div>
      </div>
    </main>
  );
}

export default Login;
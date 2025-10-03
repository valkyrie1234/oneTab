import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/storeAuth";
import { AuthAPI } from "../../api/client";
import type { IApiResponse, IAuthLoginResponse } from "../../api/types";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await AuthAPI.login(email, password) as IApiResponse<IAuthLoginResponse>;

      if (response.success) {
        const { user, tokens } = response.data;
        
        // Сохраняем в Zustand и localStorage
        login(user, tokens.accessToken, tokens.refreshToken);
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);

        // Редирект в зависимости от роли
        if (user.role === "ADMIN") {
          navigate("/admin");
        } else if (user.role === "MODERATOR") {
          navigate("/moderator");
        } else {
          navigate("/");
        }
      } else {
        setError(response.error || "Ошибка входа");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка подключения к серверу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>🎮 ВХОД</h1>
        <p className={styles.subtitle}>QuestTab - Геймификация задач</p>

        {error && <div className={styles.error}>❌ {error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>📧 EMAIL</label>
            <input
              type="email"
              className={styles.input}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>🔒 ПАРОЛЬ</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "⏳ Вход..." : "🚀 ВОЙТИ"}
          </button>
        </form>

        <div className={styles.switchLink}>
          Нет аккаунта?{" "}
          <Link to="/register">Зарегистрироваться</Link>
        </div>

        <div className={styles.switchLink} style={{ marginTop: '10px', fontSize: '12px' }}>
          Тестовые аккаунты:<br />
          👤 user@example.com / password123<br />
          👑 admin@example.com / admin123
        </div>
      </div>
    </div>
  );
};

export default Login;


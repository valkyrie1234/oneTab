import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/storeAuth";
import { AuthAPI } from "../../api/client";
import type { IApiResponse, IAuthRegisterResponse } from "../../api/types";
import styles from "../Login/Login.module.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Валидация
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    if (username.length < 3) {
      setError("Имя пользователя должно содержать минимум 3 символа");
      return;
    }

    setLoading(true);

    try {
      const response = await AuthAPI.register(username, email, password) as IApiResponse<IAuthRegisterResponse>;

      if (response.success) {
        const { user, tokens } = response.data;
        
        // Сохраняем
        login(user, tokens.accessToken, tokens.refreshToken);
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);

        // Редирект на главную (новый пользователь всегда USER)
        navigate("/");
      } else {
        setError(response.error || "Ошибка регистрации");
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
        <h1 className={styles.title}>✨ РЕГИСТРАЦИЯ</h1>
        <p className={styles.subtitle}>Создай аккаунт и начни получать награды!</p>

        {error && <div className={styles.error}>❌ {error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>👤 ИМЯ ПОЛЬЗОВАТЕЛЯ</label>
            <input
              type="text"
              className={styles.input}
              placeholder="player1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>

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
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>🔑 ПОДТВЕРЖДЕНИЕ ПАРОЛЯ</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "⏳ Регистрация..." : "🎉 ЗАРЕГИСТРИРОВАТЬСЯ"}
          </button>
        </form>

        <div className={styles.switchLink}>
          Уже есть аккаунт?{" "}
          <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;


import { Component, ErrorInfo, ReactNode } from "react";
import styles from "./ErrorBoundary.module.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("❌ Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <h1 className={styles.title}>⚠️ Упс! Что-то пошло не так</h1>
            <p className={styles.subtitle}>Произошла ошибка в приложении</p>

            {this.state.error && (
              <div className={styles.errorBox}>
                <div className={styles.errorTitle}>Ошибка:</div>
                <div className={styles.errorMessage}>
                  {this.state.error.toString()}
                </div>
              </div>
            )}

            {import.meta.env.DEV && this.state.errorInfo && (
              <details className={styles.details}>
                <summary className={styles.summary}>
                  📋 Подробности (только в dev режиме)
                </summary>
                <pre className={styles.stackTrace}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className={styles.actions}>
              <button className={styles.button} onClick={this.handleReset}>
                🏠 Вернуться на главную
              </button>
              <button
                className={styles.button}
                onClick={() => window.location.reload()}
              >
                🔄 Перезагрузить страницу
              </button>
            </div>

            <p className={styles.hint}>
              Если проблема повторяется, попробуйте выйти и войти заново.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


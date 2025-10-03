import { Route, Routes } from "react-router-dom";
import "./App.css";
import { routes } from "./routes/consts";
import useLoadData from "./hooks/useLoadData";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import ToastContainer from "./Components/ToastContainer/ToastContainer";
import useAuthStore from "./store/storeAuth";

function App() {
  const user = useAuthStore((state) => state.user);
  
  console.log("🎮 App render, user:", user);
  
  // Загружаем доски и задачи при монтировании/логине
  useLoadData();

  return (
    <ErrorBoundary>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element}/>
        ))}
      </Routes>
      
      {/* Toast уведомления */}
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;

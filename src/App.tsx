import { Route, Routes } from "react-router-dom";
import "./App.css";
import { routes } from "./routes/consts";

function App() {
  return (
      <Routes>
        {routes.map((route) => (
          <Route  path={route.path} element={route.element}/>
        ))}
      </Routes>
  );
}

export default App;

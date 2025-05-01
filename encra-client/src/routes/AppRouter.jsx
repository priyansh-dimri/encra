import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ChatPage from "../pages/ChatPage";
import NotFoundPage from "../pages/NotFoundPage";

const AppRouter = ({ mode, toggleTheme }) => (
  <Routes>
    <Route
      path="/"
      element={<LandingPage mode={mode} toggleTheme={toggleTheme} />}
    />
    <Route
      path="/login"
      element={<LoginPage mode={mode} toggleTheme={toggleTheme} />}
    />
    <Route
      path="/register"
      element={<RegisterPage mode={mode} toggleTheme={toggleTheme} />}
    />
    <Route
      path="/chat"
      element={<ChatPage mode={mode} toggleTheme={toggleTheme} />}
    />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRouter;

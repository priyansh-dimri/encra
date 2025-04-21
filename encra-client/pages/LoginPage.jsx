import Header from "../components/layout/Header";
import LoginForm from "../components/login/LoginForm";

const LandingPage = ({ mode, toggleTheme }) => {
  return (
    <>
      <Header mode={mode} toggleTheme={toggleTheme} />
      <main>
        <LoginForm />
      </main>
    </>
  );
};

export default LandingPage;

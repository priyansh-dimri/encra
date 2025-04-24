import Header from "../components/layout/Header";
import RegisterForm from "../components/register/RegisterForm";

const LandingPage = ({ mode, toggleTheme }) => {
  return (
    <>
      <Header mode={mode} toggleTheme={toggleTheme} />
      <main>
        <RegisterForm />
      </main>
    </>
  );
};

export default LandingPage;

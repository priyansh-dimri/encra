import Header from "../components/layout/Header";
import NotFoundSection from "../components/layout/NotFoundSection";

const NotFoundPage = ({ mode, toggleTheme }) => {
  return (
    <>
      <Header mode={mode} toggleTheme={toggleTheme} />
      <main>
        <NotFoundSection />
      </main>
    </>
  );
};

export default NotFoundPage;

import Header from "../components/layout/Header";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import CryptoTechSection from "../components/landing/CryptoTechSection";
import CallToAction from "../components/landing/CallToAction";

const LandingPage = ({ mode, toggleTheme }) => {
  return (
    <>
      <Header mode={mode} toggleTheme={toggleTheme} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CryptoTechSection />
        <CallToAction />
      </main>
    </>
  );
};

export default LandingPage;

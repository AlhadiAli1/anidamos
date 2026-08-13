import Navbar   from "./components/Navbar";
import Hero     from "./components/Hero";
import Menu     from "./components/Menu";
import Offers   from "./components/Offers";
import Features from "./components/Features";
import Contact  from "./components/Contact";
import Footer   from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Menu />
      <Offers />
      <Features />
      <Contact />
      <Footer />
    </>
  );
}

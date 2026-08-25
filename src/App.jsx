import Navbar   from "./components/Navbar";
import Hero     from "./components/Hero";
import Menu     from "./components/Menu";
import Offers   from "./components/Offers";
import Features from "./components/Features";
import Contact  from "./components/Contact";
import Footer   from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import CartToast from "./components/CartToast";
import { CartProvider } from "./context/CartContext";
import StartupIntro from "./components/StartupIntro";

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <StartupIntro />
      <Hero />
      <Menu />
      <Offers />
      <Features />
      <Contact />
      <Footer />
      <CartDrawer />
      <CartToast />
    </CartProvider>
  );
}

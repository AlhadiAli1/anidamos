const fs = require("fs");
const path = require("path");

const dir = "C:/Users/alihadi/Desktop/andiamos-react/src";

fs.writeFileSync(
  path.join(dir, "App.jsx"),
  `import Navbar   from "./components/Navbar";
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
`
);

fs.writeFileSync(
  path.join(dir, "main.jsx"),
  `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`
);

console.log("Files written successfully.");

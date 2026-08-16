import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Particles from "./components/Particles";
import AiChat from "./components/AiChat";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Report from "./pages/Report";
import Community from "./pages/Community";
import Solutions from "./pages/Solutions";
import Assistant from "./pages/Assistant";
import Emergency from "./pages/Emergency";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="app-shell">
      <Particles />
      <ScrollToTop />
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/report" element={<Report />} />
          <Route path="/community" element={<Community />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <AiChat />
    </div>
  );
}

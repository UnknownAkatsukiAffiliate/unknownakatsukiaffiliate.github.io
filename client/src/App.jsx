import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "./pages/HomePage.jsx";
import Services from "./pages/Services.jsx";
import Membership from "./pages/Membership.jsx";
import Registration from "./pages/Registration.jsx";
import UsefulInfo from "./pages/UsefulInfo.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";

function App() {
  const location = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<Services />} />
      <Route path="/membership" element={<Membership />} />
      <Route path="/membership/register" element={<Registration />} />
      <Route path="/useful-info" element={<UsefulInfo />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
    </Routes>
  );
}

export default App;
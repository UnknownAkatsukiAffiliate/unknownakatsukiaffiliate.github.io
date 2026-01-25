import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

// Import logo
const logoImg = new URL("../images/CID1.png", import.meta.url).href;

// Throttle function for better performance
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const animationFrame = useRef(null);

  const [lang, setLang] = useState(() => localStorage.getItem("site_lang") || "EN");
  const [isCompact, setIsCompact] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("site_lang", lang);
  }, [lang]);

  // Optimized scroll handler with requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      animationFrame.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const shouldBeCompact = scrollTop > 100;
        setIsCompact(shouldBeCompact);
      });
    };

    // Throttled resize handler
    const handleResize = throttle(() => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    }, 100);

    // Initial check
    handleResize();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const goToReportSection = (e) => {
    e?.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById("report");
      if (el) {
        // Updated navbar height calculations
        const navbarHeight = isCompact ? 120 : 160;
        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        const firstInput = el.querySelector("input, textarea, button");
        firstInput?.focus();
        return;
      }
    }

    navigate("/", { replace: false });
    setTimeout(() => {
      const el = document.getElementById("report");
      if (el) {
        // Updated navbar height calculations
        const navbarHeight = isCompact ? 120 : 160;
        const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        const firstInput = el.querySelector("input, textarea, button");
        firstInput?.focus();
      }
    }, 120);
  };

  // Hover effects for mouse events
  const handleMouseOver = (e) => {
    if (e.target.style) {
      if (e.target.getAttribute("data-type") === "report") {
        e.target.style.background = "#c82333";
      } else {
        e.target.style.color = "#2c5530";
      }
    }
  };

  const handleMouseOut = (e) => {
    if (e.target.style) {
      if (e.target.getAttribute("data-type") === "report") {
        e.target.style.background = "#dc3545";
      } else {
        e.target.style.color = "#333";
      }
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper function to build class names
  const buildClassName = (baseClass, condition, conditionalClass) => {
    return condition ? `${baseClass} ${conditionalClass}` : baseClass;
  };

  // call when a nav item is clicked
  const handleNavClick = (path, e) => {
    // close mobile menu if open
    setIsMobileMenuOpen(false);

    // if already on the same route, force scroll to top (and optionally re-focus)
    if (location.pathname === path) {
      e.preventDefault?.();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      // optionally ensure hash is cleared so repeated clicks still work
      history.replaceState(null, "", path);
    }
    // otherwise, allow the <Link> to navigate normally; App.jsx already scrolls to top on route change
  };

  return (
    <>
      {/* FIXED NAVBAR - STAYS AT TOP */}
      <div className="navbar-wrapper">
        {/* Top bar with contact on the left and language selection on the right */}
        <div className={buildClassName("top-bar", isCompact, "top-bar-hidden")}>
          <div className="top-bar-inner">
            <div className="contact">
              <a href="tel:0181750287" className="contact-item">018 175 0287</a>
              <span className="contact-item">|</span>
              <a href="mailto:bestuur@cpcid.co.za" className="contact-item">bestuur@cpcid.co.za</a>
            </div>

            <div>
              <button
                aria-label="Select English"
                title="English"
                onClick={() => setLang("EN")}
                className={buildClassName("lang-btn", lang === "EN", "lang-btn-active")}
              >
                EN
              </button>
              <button
                aria-label="Select Afrikaans"
                title="Afrikaans"
                onClick={() => setLang("AF")}
                className={buildClassName("lang-btn", lang === "AF", "lang-btn-active")}
              >
                AF
              </button>
            </div>
          </div>
        </div>

        {/* Main header / navbar */}
        <nav className={buildClassName("navbar-main navbar navbar-expand-lg navbar-light bg-white", isCompact, "navbar-main-compact")}>
          <div className="navbar-container">
            <div className="d-flex align-items-center justify-content-between w-100">
              {/* Logo - clickable, navigates to homepage */}
              <div
                className={buildClassName("logo-container", isCompact, "logo-container-compact")}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
                tabIndex={0}
                role="button"
                aria-label="Go to homepage"
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") navigate("/"); }}
              >
                <img
                  src={logoImg}
                  alt="Cachet Park CID Logo"
                  className={buildClassName("logo", isCompact, "logo-compact")}
                />
              </div>

              {/* Mobile menu button */}
              {isMobile && (
                <button 
                  className="navbar-toggler border-0"
                  type="button"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              )}

              {/* Navigation links - Custom layout to match original design */}
              <div className={buildClassName(
                buildClassName("custom-nav", isCompact, "custom-nav-compact"),
                isMobileMenuOpen,
                "custom-nav-mobile-open"
              )}>
                <Link
                  to="/"
                  className={buildClassName("nav-link-custom", isCompact, "nav-link-compact")}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={(e) => handleNavClick("/", e)}
                >
                  HOME
                </Link>
                <Link
                  to="/about"
                  className={buildClassName("nav-link-custom", isCompact, "nav-link-compact")}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={(e) => handleNavClick("/about", e)}
                >
                  ABOUT US
                </Link>
                <Link
                  to="/services"
                  className={buildClassName("nav-link-custom", isCompact, "nav-link-compact")}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={(e) => handleNavClick("/services", e)}
                >
                  SERVICES
                </Link>
                <Link
                  to="/useful-info"
                  className={buildClassName("nav-link-custom", isCompact, "nav-link-compact")}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={(e) => handleNavClick("/useful-info", e)}
                >
                  USEFUL INFORMATION
                </Link>
                <Link
                  to="/membership"
                  className={buildClassName("nav-link-custom", isCompact, "nav-link-compact")}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={(e) => handleNavClick("/membership", e)}
                >
                  MEMBERSHIP
                </Link>
                <Link
                  to="/contact"
                  className={buildClassName("nav-link-custom", isCompact, "nav-link-compact")}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  onClick={(e) => handleNavClick("/contact", e)}
                >
                  CONTACT US
                </Link>
                <button
                  className={buildClassName("report-btn", isCompact, "report-btn-compact")}
                  onClick={goToReportSection}
                  aria-label="Report a problem"
                  title="Report a problem"
                  data-type="report"
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  REPORT A PROBLEM
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
      
      {/* SPACER - INCREASED HEIGHT FOR MORE SPACE BETWEEN NAVBAR AND CONTENT */}
      <div
        className={buildClassName("navbar-spacer", isCompact, "navbar-spacer-compact")}
        style={{
          height: isMobile ? (isCompact ? 80 : 120) : (isCompact ? 120 : 160),
          transition: 'height 0.3s',
        }}
      />
    </>
  );
}
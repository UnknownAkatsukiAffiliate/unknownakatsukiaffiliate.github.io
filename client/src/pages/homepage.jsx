import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/footer.jsx";
import "./HomePage.css";

// Hero background image
const bg = new URL("../images/Borchard Street.jpg", import.meta.url).href;

// Partner & sponsor images
const sponsorImg1 = new URL("../images/download (15).jpg", import.meta.url).href;
const intfinImg = new URL("../images/intfin.png", import.meta.url).href;
const nwuImg = new URL("../images/nwu.png", import.meta.url).href;
const sponsorImg4 = new URL("../images/download (16).jpg", import.meta.url).href;
const heraldImg = new URL("../images/Potch Herald.png", import.meta.url).href;
const goToGuyImg = new URL("../images/the go to guy.png", import.meta.url).href;
const potchChamberImg = new URL("../images/Potch chamvber of commerce.png", import.meta.url).href;
const buzzerImg = new URL("../images/buzzer.jpg", import.meta.url).href;

// FAQ/Report images
const lidgeldImg = new URL("../images/Lidgeld_verduideliking-02.jpg", import.meta.url).href;

// API base (frontend -> backend)
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  `${window.location.protocol}//${window.location.hostname}:3000`;
const COMPLAINTS_URL = `${API_BASE}/api/complaints`; // (old backend endpoint – now replaced by Web3Forms)

export default function HomePage() {
  const location = useLocation();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [errors, setErrors] = useState({
    name: "",
    contact: "",
    phone: "",
    message: "",
  });

  const partners = [
    { name: "Sponsor", url: "#", img: sponsorImg1 },
    { name: "intfin", url: "https://www.intfingroup.co.za", img: intfinImg },
    { name: "NWU", url: "https://www.nwu.ac.za", img: nwuImg },
    { name: "Sponsor 4", url: "#", img: null },
    { name: "Herald", url: "https://www.citizen.co.za/potchefstroom-herald/", img: heraldImg },
    { name: "The Go To Spot", url: "https://www.thegotoguy.co.za", img: goToGuyImg },
    { name: "Potchefstroom", url: "https://www.potchsakekamer.co.za/", img: potchChamberImg },
    { name: "Buzzer", url: "https://www.buzzer-app.co.za", img: buzzerImg },
  ];

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
  const validatePhone = (v) => {
    if (!v) return false;
    const digits = String(v).replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  };

  const handlePrevPartner = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : partners.length - 2));
  };

  const handleNextPartner = () => {
    setCarouselIndex((prev) => (prev < partners.length - 2 ? prev + 1 : 0));
  };

  const validateAll = () => {
    const next = { name: "", contact: "", phone: "", message: "" };
    if (!contact.trim()) next.contact = "Please provide an email address.";
    else if (!validateEmail(contact.trim())) next.contact = "Please enter a valid email address.";
    
    if (phone.trim() && !validatePhone(phone.trim())) {
      next.phone = "Please enter a valid phone number (7–15 digits).";
    }
    
    if (!message.trim()) next.message = "Problem description is required.";
    setErrors(next);
    return !next.name && !next.contact && !next.phone && !next.message;
  };

  const handleBlur = (field) => {
    const next = { ...errors };
    if (field === "name") {
      next.name = "";
    } else if (field === "contact") {
      if (!contact.trim()) next.contact = "Please provide an email address.";
      else if (!validateEmail(contact.trim())) next.contact = "Please enter a valid email address.";
      else next.contact = "";
    } else if (field === "phone") {
      if (phone.trim() && !validatePhone(phone.trim())) {
        next.phone = "Please enter a valid phone number (7–15 digits).";
      } else {
        next.phone = "";
      }
    } else if (field === "message") {
      next.message = message.trim() ? "" : "Problem description is required.";
    }
    setErrors(next);
  };

  // refs for small reveal animations only (CSS handles layout)
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("animate");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    if (titleRef.current) obs.observe(titleRef.current);
    if (subtitleRef.current) obs.observe(subtitleRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (location.hash === "#report") {
      const el = document.getElementById("report");
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [location]);

  // remove any previously saved local complaints
  useEffect(() => {
    try {
      localStorage.removeItem("cid_reports");
    } catch {}
  }, []);

  // Preload Google Maps resources for faster ContactUs page load
  useEffect(() => {
    const links = [
      { rel: 'dns-prefetch', href: 'https://maps.google.com' },
      { rel: 'dns-prefetch', href: 'https://maps.gstatic.com' },
      { rel: 'dns-prefetch', href: 'https://maps.googleapis.com' },
      { rel: 'preconnect', href: 'https://maps.google.com' },
      { rel: 'preconnect', href: 'https://maps.gstatic.com', crossOrigin: 'anonymous' }
    ];

    const linkElements = links.map(({ rel, href, crossOrigin }) => {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (crossOrigin) link.crossOrigin = crossOrigin;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      linkElements.forEach(link => document.head.removeChild(link));
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setSent(true);

    const c = contact.trim();
    const formData = {
      access_key: import.meta.env.VITE_WEB3FORMS_KEY,
      to: "kyleogle12@gmail.com",
      subject: name.trim() || "Report",
      from_name: name.trim() || "Anonymous",
      from_email: c,
      reply_to: c,
      phone: phone.trim(),
      message: message.trim(),
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Submission failed");
      }

      alert("Report submitted successfully.");
      setName("");
      setContact("");
      setPhone("");
      setMessage("");
      setErrors({ name: "", contact: "", phone: "", message: "" });
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Could not submit. Please try again.");
    } finally {
      setSent(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main>
        {/* Hero Section with background image */}
        <section
          id="hero"
          ref={heroRef}
          className="hero"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="hero-overlay" />
          <div className="hero-inner">
            <h1 ref={titleRef} className="hero-title-anim">
              Welcome to CID — Cachet Park
            </h1>
            <p ref={subtitleRef} className="hero-subtitle-anim">
              City Improvement District
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="section">
          <div className="home-container">
            <h2 className="section-title">About Cachet Park</h2>
            <p className="section-subtitle">
              Cachet Park CID was founded in 2018 when dedicated residents, business owners, school principals and staff and students believed in and became part of a proposed solution. The mission is simple – to ensure that the environment – within which the Bult is located as the heartbeat of Potchefstroom – is kept clean of all unwanted elements. Former Vice-Chancellor of the NWU, Potchefstroom Campus, Professor Fika Janse van Rensburg was then at the steer of the project.
            </p>
            <p className="section-subtitle">
              Cachet Park CID is a non-profit organization whose primary purpose is to keep the designated demarcated area clean, safe, and tidy. The founding members, JB Marks Municipality and the NWU, Potchefstroom Campus, made the launch of this organization possible.
            </p>
            <p className="section-subtitle">Since then, funding has taken place through voluntary member contributions and donations.</p>

            <div className="grid" style={{ marginTop: "40px" }}>
              <div className="card">
                <h3 className="card-title">Safety & Security</h3>
                <p className="card-text">24/7 patrols and surveillance to ensure a safe environment for all community members with dedicated security personnel.</p>
              </div>
              <div className="card">
                <h3 className="card-title">Cleanliness & Maintenance</h3>
                <p className="card-text">Regular cleaning and maintenance of public spaces, parks, and streets to uphold our high standards of urban living.</p>
              </div>
              <div className="card">
                <h3 className="card-title">Community Engagement</h3>
                <p className="card-text">Organizing events and initiatives that bring residents and businesses together to build a stronger community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Report Form Section */}
        <section id="report" className="section section-bg">
          <div className="home-container">
            <h2 className="section-title">Report a Problem</h2>
            <p className="section-subtitle">Help us keep Cachet Park clean, safe, and beautiful by reporting any issues you encounter.</p>

            <form onSubmit={handleSubmit} className="form-container">
              <div className="form-group">
                <label className="form-label">Your Name (Optional)</label>
                <input 
                  className="form-field" 
                  value={name} 
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  onBlur={() => handleBlur("name")}
                  placeholder="Full name" 
                />
                {errors.name && (
                  <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email <span className="required">*</span>
                </label>
                <input
                  className="form-field"
                  value={contact}
                  onChange={(e) => {
                    setContact(e.target.value);
                    if (errors.contact) setErrors((prev) => ({ ...prev, contact: "" }));
                  }}
                  onBlur={() => handleBlur("contact")}
                  placeholder="Email address"
                  aria-invalid={!!errors.contact}
                />
                {errors.contact && (
                  <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>
                    {errors.contact}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (Optional)</label>
                <input
                  className="form-field"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  onBlur={() => handleBlur("phone")}
                  placeholder="Phone number (optional)"
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>
                    {errors.phone}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Problem Description <span className="required">*</span>
                </label>
                <textarea
                  className="form-field form-textarea"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
                  }}
                  onBlur={() => handleBlur("message")}
                  placeholder="Please describe the issue in detail..."
                  required
                  aria-invalid={!!errors.message}
                  aria-required="true"
                />
                {errors.message && (
                  <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>
                    {errors.message}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" disabled={sent} className="submit-btn">
                  {sent ? "SUBMITTING..." : "SUBMIT REPORT"}
                </button>
                <button type="button" onClick={() => { setName(""); setContact(""); setPhone(""); setMessage(""); setErrors({ name: "", contact: "", phone: "", message: "" }); }} className="clear-btn">
                  CLEAR FORM
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Mandate / Municipality Contact Section */}
        <section className="section">
          <div className="home-container">
            <h2>What do we not have a mandate for?</h2>
            <ul className="mandate-list">
              <li className="mandate-item">Replacement of streetlights</li>
              <li className="mandate-item">Replacement of road signs</li>
              <li className="mandate-item">Repair of water leaks</li>
              <li className="mandate-item">Repair of potholes</li>
              <li className="mandate-item">Painting of roads</li>
              <li className="mandate-item">Opening of storm drains</li>
              <li className="mandate-item">Silencing noise makers</li>
            </ul>

            <p>If your complaint involves one of the above, we will pass it on to the municipality. You are also welcome to contact them yourself through one of the following channels:</p>

            <h3>Contact the municipality at:</h3>
            <ul className="contact-list">
              <li className="contact-item">081 299 5111 (Inquiries)</li>
              <li className="contact-item">018 299 5408 (JBM Water, Roads and Infrastructure)</li>
              <li className="contact-item">081 299 5350 (JBM Electricity and Street Lights)</li>
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section">
          <div className="home-container">
            <h2 className="section-title">Frequently Asked Questions</h2>

            <div className="faq-container">
              <div className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => setExpandedFAQ(expandedFAQ === 0 ? null : 0)}
                  aria-expanded={expandedFAQ === 0}
                >
                  <span>How do i become a member of Cachet Park CID?</span>
                  <span className="faq-toggle">{expandedFAQ === 0 ? '−' : '+'}</span>
                </button>
                {expandedFAQ === 0 && (
                  <div className="faq-answer">
                    Anyone living in the demarcated area of the Cachet Park CID can become a member of the project. Simply click the register link found on our Membership page to get started with the registration process.
                  </div>
                )}
              </div>

              <div className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => setExpandedFAQ(expandedFAQ === 1 ? null : 1)}
                  aria-expanded={expandedFAQ === 1}
                >
                  <span>How is the monthly membership fee calculated?</span>
                  <span className="faq-toggle">{expandedFAQ === 1 ? '−' : '+'}</span>
                </button>
                {expandedFAQ === 1 && (
                  <div className="faq-answer">
                    <img src={lidgeldImg} alt="Monthly membership fee calculation" style={{ width: '100%', maxWidth: '600px', marginTop: '15px', borderRadius: '6px' }} />
                  </div>
                )}
              </div>

              <div className="faq-item">
                <button 
                  className="faq-question"
                  onClick={() => setExpandedFAQ(expandedFAQ === 2 ? null : 2)}
                  aria-expanded={expandedFAQ === 2}
                >
                  <span>Does the monthly CID fee replace the fees and tax we pay to the municipality?</span>
                  <span className="faq-toggle">{expandedFAQ === 2 ? '−' : '+'}</span>
                </button>
                {expandedFAQ === 2 && (
                  <div className="faq-answer">
                    Cachet Park CID is in discussion and negotiation with JB Marks Municipality to arrange for the total service delivery to be taken over and the municipality to be billed monthly. However, negotiations have not yet been concluded and currently fees are payable to both parties.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Partners & Sponsors Section */}
        <section className="section">
          <div className="home-container">
            <h2 className="section-title">Our Partners & Sponsors</h2>
            
            {/* Desktop Grid */}
            <div className="partners-grid">
              <div className="partner-card">
                <img src={sponsorImg1} alt="Sponsor" />
              </div>
              <div className="partner-card">
                <a href="https://www.intfingroup.co.za" target="_blank" rel="noopener noreferrer">
                  <img src={intfinImg} alt="intfin" />
                </a>
              </div>
              <div className="partner-card">
                <a href="https://www.nwu.ac.za" target="_blank" rel="noopener noreferrer">
                  <img src={nwuImg} alt="NWU" />
                </a>
              </div>
              <div className="partner-card">
                <img src={sponsorImg4} alt="Sponsor" />
              </div>
              <div className="partner-card">
                <a href="https://www.citizen.co.za/potchefstroom-herald/" target="_blank" rel="noopener noreferrer">
                  <img src={heraldImg} alt="Herald" />
                </a>
              </div>
              <div className="partner-card">
                <a href="https://www.thegotoguy.co.za" target="_blank" rel="noopener noreferrer">
                  <img src={goToGuyImg} alt="The Go To Spot" />
                </a>
              </div>
              <div className="partner-card">
                <a href="https://www.potchsakekamer.co.za/" target="_blank" rel="noopener noreferrer">
                  <img src={potchChamberImg} alt="Potchefstroom" />
                </a>
              </div>
              <div className="partner-card">
                <a href="https://www.buzzer-app.co.za" target="_blank" rel="noopener noreferrer">
                  <img src={buzzerImg} alt="Buzzer" />
                </a>
              </div>
            </div>

            {/* Mobile Carousel */}
            <div className="partners-carousel">
              <button 
                className="carousel-nav-btn" 
                onClick={handlePrevPartner}
                disabled={carouselIndex === 0}
                aria-label="Previous partners"
              >
                ←
              </button>
              
              <div className="carousel-container">
                {partners.slice(carouselIndex, carouselIndex + 2).map((partner) => (
                  <div key={partner.name} className="partner-card">
                    <a href={partner.url} target="_blank" rel="noopener noreferrer">
                      <img src={partner.img} alt={partner.name} />
                    </a>
                  </div>
                ))}
              </div>
              
              <button 
                className="carousel-nav-btn" 
                onClick={handleNextPartner}
                disabled={carouselIndex >= partners.length - 2}
                aria-label="Next partners"
              >
                →
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
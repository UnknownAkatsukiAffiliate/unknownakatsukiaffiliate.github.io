import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/footer.jsx";
import "./ContactUs.css";

export default function ContactUs() {
  const fullAddress =
    "Cachet Park CID NPC Potchefstroom — Shop 6 , Cachet Park Shopping Complex, Steve Biko St, Die Bult, Potchefstroom, 2531";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    msg: "",
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

  const validatePhone = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  };

  const validateAll = () => {
    const next = { name: "", phone: "", email: "", msg: "" };
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!validateEmail(email))
      next.email = "Please enter a valid email address.";
    if (phone.trim() && !validatePhone(phone))
      next.phone = "Please enter a valid phone number (7–15 digits).";
    if (!msg.trim()) next.msg = "Message is required.";
    setErrors(next);
    return !next.name && !next.phone && !next.email && !next.msg;
  };

  const handleBlur = (field) => {
    const next = { ...errors };
    if (field === "name") {
      next.name = name.trim() ? "" : "Name is required.";
    } else if (field === "email") {
      if (!email.trim()) next.email = "Email is required.";
      else if (!validateEmail(email))
        next.email = "Please enter a valid email address.";
      else next.email = "";
    } else if (field === "phone") {
      if (phone.trim() && !validatePhone(phone))
        next.phone = "Please enter a valid phone number (7–15 digits).";
      else next.phone = "";
    } else if (field === "msg") {
      next.msg = msg.trim() ? "" : "Message is required.";
    }
    setErrors(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setSent(true);

    const formData = {
      access_key: import.meta.env.VITE_WEB3FORMS_KEY || "a12bd0e6-8973-4086-821d-30a958aa54ad",
      to: "kyleogle12@gmail.com",
      subject: name.trim() || "Website Contact",
      from_name: name,
      from_email: email,
      reply_to: email,
      phone: phone,
      message: msg,
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Your message has been sent successfully!");
        setName("");
        setPhone("");
        setEmail("");
        setMsg("");
        setErrors({ name: "", phone: "", email: "", msg: "" });
      } else {
        alert(
          "There was a problem sending your message: " +
            (result.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setSent(false);
    }
  };

  // Preload map immediately on component mount
  useEffect(() => {
    // Small delay to prioritize initial page render
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="contact-page">
      <Navbar />

      <header className="page-header">
        <div className="about-container">
          <h1 className="page-title">Contact Us</h1>
        </div>
      </header>

      <main className="content-section">
        <div className="about-container contact-grid">
          <div className="contact-left">
            <section className="section">
              <h2 className="section-title">Contact Details</h2>

              <div className="contact-block">
                <p>
                  <strong>Tel:</strong> +27 18 175 0287
                </p>
                <p>
                  <strong>E-mail Address:</strong> <a href="mailto:bestuur@cpcid.co.za">bestuur@cpcid.co.za</a>
                </p>
                <p>
                  <strong>Address:</strong><br />
                  Cachet Park CID NPC Potchefstroom — Shop 6 , Cachet Park Shopping Complex, Steve Biko St, Die Bult, Potchefstroom, 2531
                </p>
                <p>
                  <strong>Other contact details:</strong><br />
                  <a href="mailto:finansies@cpcid.co.za">finansies@cpcid.co.za</a>
                </p>

                <p>
                  <strong>Social:</strong>
                </p>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <a
                    href="https://www.facebook.com/cachetparkcid/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Cachet Park CID on Facebook"
                    style={{ display: "inline-block" }}
                  >
                    <img
                      src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/facebook.svg"
                      alt="Facebook"
                      style={{ width: 28, height: 28 }}
                    />
                  </a>

                  <a
                    href="https://www.instagram.com/cachetparkcid/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Cachet Park CID on Instagram"
                    style={{ display: "inline-block" }}
                  >
                    <img
                      src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/instagram.svg"
                      alt="Instagram"
                      style={{ width: 28, height: 28 }}
                    />
                  </a>
                </div>
              </div>
            </section>

            <section className="section section-bg">
              <h2 className="section-title">Send Us a Message</h2>
              <p className="section-subtitle">
                Use the form below to send a message to Cachet Park CID. We will
                respond to inquiries as soon as possible.
              </p>

              <form
                className="form-container"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="form-group">
                  <label className="form-label">Name and Surname</label>
                  <input
                    className="form-field"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    onBlur={() => handleBlur("name")}
                    placeholder="Full name"
                    required
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && (
                    <div
                      className="form-error"
                      style={{ color: "#c00", marginTop: 6 }}
                    >
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    className="form-field"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    onBlur={() => handleBlur("email")}
                    placeholder="Email address"
                    required
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <div
                      className="form-error"
                      style={{ color: "#c00", marginTop: 6 }}
                    >
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Number (Optional)</label>
                  <input
                    className="form-field"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone)
                        setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    onBlur={() => handleBlur("phone")}
                    placeholder="Phone number (optional)"
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <div
                      className="form-error"
                      style={{ color: "#c00", marginTop: 6 }}
                    >
                      {errors.phone}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-field form-textarea"
                    value={msg}
                    onChange={(e) => {
                      setMsg(e.target.value);
                      if (errors.msg)
                        setErrors((prev) => ({ ...prev, msg: "" }));
                    }}
                    onBlur={() => handleBlur("msg")}
                    placeholder="Your message..."
                    required
                    aria-invalid={!!errors.msg}
                  />
                  {errors.msg && (
                    <div
                      className="form-error"
                      style={{ color: "#c00", marginTop: 6 }}
                    >
                      {errors.msg}
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button className="submit-btn" type="submit">
                    {sent ? "SENDING..." : "Send"}
                  </button>
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => {
                      setName("");
                      setPhone("");
                      setEmail("");
                      setMsg("");
                      setErrors({
                        name: "",
                        phone: "",
                        email: "",
                        msg: "",
                      });
                    }}
                  >
                    Clear
                  </button>
                </div>
              </form>
            </section>
          </div>

          <aside className="contact-right">
            <div className="map-wrap" ref={mapRef}>
              {mapLoaded ? (
                    <iframe
                      title="Cachet Park map"
                      src="https://maps.google.com/maps?q=Cachet+Park+Shopping+Complex+Steve+Biko+St+Die+Bult+Potchefstroom+2531&z=15&output=embed"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="map-iframe"
                    />
              ) : (
                <div className="map-iframe" style={{ 
                  background: '#f0f0f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: '14px'
                }}>
                  Loading map...
                </div>
              )}
            </div>

            <div className="banking-box">
              <h3 className="contact-title">Banking Details</h3>
              <p className="banking-text">
                <strong>Bank:</strong> Nedbank (Current Account)
                <br />
                <strong>Account number:</strong> 118 0762 444
                <br />
                <strong>Branch Code:</strong> 198 765
              </p>

              <h4 className="contact-title" style={{ marginTop: 12 }}>
                Office Contacts
              </h4>
              <p className="banking-text">
                Tel: +27 18 175 0287
                <br />
                E-mail:{" "}
                <a href="mailto:bestuur@cpcid.co.za">bestuur@cpcid.co.za</a>
                <br />
                <strong>Address:</strong>
                <br />
                {fullAddress}
              </p>

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <a
                  href="https://www.facebook.com/cachetparkcid/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Cachet Park CID on Facebook"
                  style={{ display: "inline-block" }}
                >
                  <img
                    src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/facebook.svg"
                    alt="Facebook"
                    style={{ width: 28, height: 28 }}
                  />
                </a>

                <a
                  href="https://www.instagram.com/cachetparkcid/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Cachet Park CID on Instagram"
                  style={{ display: "inline-block" }}
                >
                  <img
                    src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/instagram.svg"
                    alt="Instagram"
                    style={{ width: 28, height: 28 }}
                  />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

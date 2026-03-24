import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="services-container">
        <div className="contact-section">
          <h3 className="contact-title">Contact Us</h3>
          <div className="contact-info">
            <p>
              <strong>Address:</strong><br />
              Shop 5, Cachet Park Shopping Centre<br />
              Steve Biko Avenue<br />
              Potchefstroom<br />
              2531
            </p>
            <p>
              <strong>Phone:</strong> 018 175 0287
            </p>

            {/* social links with web-hosted logos */}
            <div className="social-links" style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
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
                  style={{ width: 64, height: 64, verticalAlign: "middle", filter: "invert(0)" }}
                />
              </a>

{/* Instagram removed */}
            </div>
          </div>
        </div>

        <p style={{ marginTop: 12 }}>
          © {new Date().getFullYear()} Cachet Park City Improvement District. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
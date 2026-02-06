import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/footer.jsx";
import "./Services.css";
import img1 from "../images/Copilot_20260114_192444.png";
import img2 from "../images/2026-Straatskoonmaak-en-Grassny-Kaart.jpg";
import img3 from "../images/2026-Vullisverwydering-Kaart.jpg";
import grassCleaningImg from "../images/grass-cutting-and-cleaning-services-area-1536x1536 (1).png";
import refuseRecyclingImg from "../images/refuse-removal-and-recycling-stats_-220-1536x1536 (1).png";
import buzzerQR from "../images/buzzer-QR-code-1-300x300.png";
import "./HomePage.css";
export default function Services() {
  return (
    <div className="services-page">
      <Navbar />
      {/* Page Header */}
      <section className="page-header">
        <div className="services-container">
          <h1 className="page-title">Services</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="content-section">
        <div className="services-container">
          <p className="intro-text">
            Cachet Park CID provides the following services to its members:
          </p>

          {/* Security Services */}
          <div className="service-category">
            <h2 className="category-title">Security</h2>
            <ul className="security-bullets">
              <li>Installation and monitoring of CCTV cameras in the demarcated area.</li>
              <li>Visible presence of security officers and vehicles in the area.</li>
              <li>Good co-operation with the NWU Protection Services and the SAPS.</li>
              <li>The availability of a “First Point of Report” for anyone experiencing distress or panic in our area.</li>
            </ul>

            {/* added image under Security services */}
            <div className="security-media">
              <img src={img1} alt="CCTV Karte" className="security-image" />
            </div>
          </div>

          {/* Cleaning Services */}
          <div className="service-category">
            <h2 className="category-title">Cleaning</h2>
            <ul className="cleaning-bullets">
              <li>Cutting grass on all sidewalks and parks</li>
              <li>Herbicides and pesticides</li>
              <li>Weekly sweeping of streets and parks</li>
              <li>Cutting of bushes, shrubs, and trees</li>
              <li>Maintenance of trees</li>
              <li>CPTED – Crime prevention through environmental design</li>
              <li>Maintenance of parks</li>
              <li>Management of litter, leaves and other rubbish (excluding household rubbish and private garden waste)</li>
            </ul>

            {/* image under Cleaning services */}
            <div className="cleaning-media">
              <img src={img2} alt="Cleaning map" className="cleaning-image" />
            </div>

            <p className="section-text" style={{ textAlign: "left", marginTop: "24px", marginBottom: "24px", fontWeight: "500", fontSize: "20px" }}>
              Did you know?
            </p>

            {/* grass cutting and cleaning services image */}
            <div className="cleaning-media">
              <img src={grassCleaningImg} alt="Grass cutting and cleaning services" className="cleaning-image" />
            </div>
          </div>

          {/* Other Services */}
          <div className="service-category">
            <h2 className="category-title">Refuse removal and recycling</h2>
            <ul className="other-services-bullets">
              <li>Regular household garbage removal as scheduled.</li>
              <li>Recycling stations located in identified areas.</li>
              <li>Management of reuse and recycling of waste.</li>
            </ul>

            {/* image under Refuse removal and recycling */}
            <div className="other-media">
              <img src={img3} alt="Refuse & Recycling map" className="other-image" />
            </div>

            <p className="section-text" style={{ textAlign: "left", marginTop: "24px", marginBottom: "24px", fontWeight: "500", fontSize: "20px" }}>
              Did you know?
            </p>

            {/* refuse removal and recycling stats image */}
            <div className="other-media">
              <img src={refuseRecyclingImg} alt="Refuse removal and recycling stats" className="other-image" />
            </div>
          </div>

          {/* Buzzer App */}
          <div className="service-category" id="buzzer-app">
            <h2 className="category-title">Buzzer App</h2>
            <p className="section-text">
              As a way of enhancing our service to you, our valued member.
            </p>

            <p className="section-text">
              We are excited to announce that we are now part of the Buzzer network.
            </p>

            <p className="section-text">
              Buzzer is a free app, which geolocates you in an emergency and alerts us to where you are, and what emergency you have, within seconds at a touch of a button.
            </p>

            <p className="section-text">
              This is just another way we are there to protect and serve you.
            </p>
            <p className="section-text"><strong>Here are the download links:</strong></p>
            <ul className="buzzer-download-links">
              <li>iOS: <a href="https://tinyurl.com/fxt66p47" target="_blank" rel="noopener noreferrer">https://tinyurl.com/fxt66p47</a></li>
              <li>Android: <a href="https://tinyurl.com/57s84zev" target="_blank" rel="noopener noreferrer">https://tinyurl.com/57s84zev</a></li>
              <li>Huawei: <a href="https://tinyurl.com/5yt3umav" target="_blank" rel="noopener noreferrer">https://tinyurl.com/5yt3umav</a></li>
            </ul>

            <p className="section-text"><strong>Or scan the QR-Code to Download BUZZER:</strong></p>
            <div className="buzzer-qr">
              <img src={buzzerQR} alt="Scan QR to download Buzzer" style={{ maxWidth: 220, width: "100%", height: "auto" }} />
            </div>

            {/* YouTube demo — responsive 16:9 wide embed */}
            <div
              className="buzzer-video"
              style={{
                position: "relative",
                paddingBottom: "56.25%" /* 16:9 */,
                height: 0,
                overflow: "hidden",
                marginTop: 16,
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/ljLWkotmJdc"
                title="Buzzer App Demo"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* shared footer */}
      <Footer />
    </div>
  );
}
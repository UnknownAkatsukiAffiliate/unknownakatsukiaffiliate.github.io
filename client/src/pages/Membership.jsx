import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import "./Membership.css";
import Footer from "../components/footer.jsx";

// Import fee calculation image
const lidgeldImg = new URL("../images/Lidgeld_verduideliking-02.jpg", import.meta.url).href;

export default function Membership() {
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    alert("Login functionality would be implemented here");
  };

  return (
    <div className="membership-page">
      <Navbar />
      
      {/* Page Header */}
      <section className="page-header">
        <div className="membership-container">
          <h1 className="page-title">Membership</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="content-section">
        <div className="membership-container">
          {/* Login Section */}
          {/* <div className="login-section">
            <h3 className="login-title">Member Login</h3>
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <input 
                type="text" 
                placeholder="Username"
                className="login-input"
              />
              <input 
                type="password" 
                placeholder="Password"
                className="login-input"
              />
              <button type="submit" className="login-button">
                LOGIN
              </button>
            </form>
            <div className="login-links">
              <a href="/forgot-password" className="login-link">Forgot Password?</a>
              <Link to="/membership/register" className="login-link">Register</Link>
            </div>
          </div> */}
          {/* Registration link (replaces member login) */}
          <div className="register-section" style={{ marginBottom: 24 }}>
             <h3 className="register-title">Become a Member</h3>
             <p className="register-text">
               To join Cachet Park CID, please complete the registration form.
             </p>
             <Link to="/membership/register" className="register-button">Register</Link>
           </div>

          <p className="intro-text">
            Cachet Park CID is a non-profit company that relies on the financial contributions of its members to provide services to the area.
          </p>

          {/* Who Can Become a Member */}
          <div className="membership-section">
            <h2 className="section-title">Who Can Become a Member?</h2>
            <p className="content-text">
              Any person or organization that owns property or runs a business in the Cachet Park CID area can become a member.
            </p>
          </div>

          {/* Benefits of Membership */}
          <div className="membership-section">
            <h2 className="section-title">Benefits of Membership</h2>
            <p className="content-text">
              As a member of Cachet Park CID, you will enjoy the following benefits:
            </p>
            <ul className="content-list">
              <li className="list-item">Improved security and reduced crime</li>
              <li className="list-item">Cleaner streets and public spaces</li>
              <li className="list-item">Increased property values</li>
              <li className="list-item">A more attractive and welcoming environment</li>
              <li className="list-item">A stronger sense of community</li>
            </ul>
          </div>

          {/* How to Become a Member */}
          <div className="membership-section">
            <h2 className="section-title">How to Become a Member</h2>
            <p className="content-text">
              To become a member of Cachet Park CID, simply click the button below to complete the registration form.
            </p>
            <Link to="/membership/register" className="register-button" style={{ marginTop: '20px', display: 'inline-block' }}>Register Now</Link>
          </div>

          {/* Membership Fees */}
          <div className="membership-section">
            <h2 className="section-title">How Are Membership Fees Calculated?</h2>
            <p className="content-text">
              Cachet Park CID membership fees are calculated based on the municipal property valuation (R-value) of your property. This ensures that fees are proportional to property size and value within the demarcated area.
            </p>
            
            <div className="fee-calculation-container">
              <h3 className="fee-subsection-title">Fee Calculation Breakdown</h3>
              <p className="content-text">
                The monthly membership fee is calculated as a percentage of your property's municipal R-value. Below is a detailed illustration of how this calculation works:
              </p>
              
              <img 
                src={lidgeldImg} 
                alt="Membership fee calculation illustration" 
                className="fee-calculation-image"
              />
              
              <div className="fee-explanation">
                <h4 className="explanation-title">Understanding Your Fee</h4>
                <ul className="content-list">
                  <li className="list-item"><strong>Municipal R-value:</strong> This is the valuation of your property as determined by JB Marks Municipality.</li>
                  <li className="list-item"><strong>Percentage Applied:</strong> A fixed percentage is applied to your property's R-value to calculate the monthly fee.</li>
                  <li className="list-item"><strong>Fair Distribution:</strong> This method ensures costs are shared fairly based on property value and size.</li>
                  <li className="list-item"><strong>Annual Review:</strong> Fees are reviewed annually and may be adjusted based on CID operational costs and inflation.</li>
                </ul>
              </div>
            </div>

            <div className="fee-details-container">
              <h3 className="fee-subsection-title">About Cachet Park CID Fees</h3>
              <p className="content-text">
                The monthly CID fee covers the cost of providing essential services to maintain and improve the Cachet Park area:
              </p>
              <ul className="content-list">
                <li className="list-item">24/7 security patrols and surveillance</li>
                <li className="list-item">Regular street cleaning and maintenance</li>
                <li className="list-item">Community engagement and development programs</li>
                <li className="list-item">Administrative and operational costs</li>
              </ul>

              <div className="important-notice">
                <h4 className="notice-title">Important Note</h4>
                <p className="notice-text">
                  The Cachet Park CID fee is separate from municipal rates and taxes. CID membership is not a replacement for municipal services but rather a supplement to enhance safety, cleanliness, and community development in the demarcated area. Both CID fees and municipal rates remain payable.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          
        </div>
      </section>

      {/* shared footer */}
      <Footer />
    </div>
  );
}
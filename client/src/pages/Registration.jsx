import React, { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import "./Registration.css";
import Footer from "../components/footer.jsx";

export default function Registration() {
  // SheetDB endpoints
  const SHEETDB_INDIVIDUAL = "https://sheetdb.io/api/v1/3w17cfbx2pp2f";
  const SHEETDB_BUSINESS = "https://sheetdb.io/api/v1/r9pd2xqoz45ph";
  const [formData, setFormData] = useState({
    // individual fields
    firstName: "",
    lastName: "",
    nationality: "",
    email: "",
    phone: "",
    propertyAddress: "",
    IDNumber: "",
    BTWNNumber: "",
    // business fields
    businessName: "",
    companyRegNumber: "",
    businessPhone: "",
    businessEmail: "",
    businessAddress: "",
    businessPOBox: "",
    // removed Additional Information fields
  });

  const [errors, setErrors] = useState({}); // validation errors
  // simple validators
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  const validatePhone = (phone) => {
    if (!phone) return false;
    const digits = String(phone).replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15; // basic length check
  };
  
  const validateSAIDNumber = (idNumber) => {
    if (!idNumber.trim()) return false;
    const digits = String(idNumber).replace(/\D/g, "");
    // South African ID must be 13 digits
    return digits.length === 13;
  };

  const validatePOBox = (poBox) => {
    if (!poBox.trim()) return false;
    // Only numbers allowed
    return /^\d+$/.test(String(poBox).trim());
  };
  
  // show only one form at a time
  const [registrationType, setRegistrationType] = useState("individual");
  const handleTypeChange = (e) => setRegistrationType(e.target.value);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear field-specific error when user edits
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (field) => {
    const newErrors = { ...errors };
    if (field === "email") {
      if (!formData.email.trim()) newErrors.email = "Email is required.";
      else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address.";
      else newErrors.email = undefined;
    } else if (field === "phone") {
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
      else if (!validatePhone(formData.phone)) newErrors.phone = "Please enter a valid phone number.";
      else newErrors.phone = undefined;
    } else if (field === "IDNumber") {
      if (!formData.IDNumber.trim()) newErrors.IDNumber = "ID number is required.";
      else if (!validateSAIDNumber(formData.IDNumber)) newErrors.IDNumber = "Please enter a valid South African ID number (13 digits).";
      else newErrors.IDNumber = undefined;
    } else if (field === "businessName") {
      newErrors.businessName = formData.businessName.trim() ? undefined : "Business name is required.";
    } else if (field === "businessAddress") {
      newErrors.businessAddress = formData.businessAddress.trim() ? undefined : "Business address is required.";
    } else if (field === "businessPOBox") {
      if (!formData.businessPOBox.trim()) newErrors.businessPOBox = "PO Box is required.";
      else if (!validatePOBox(formData.businessPOBox)) newErrors.businessPOBox = "PO Box must contain only numbers.";
      else newErrors.businessPOBox = undefined;
    } else if (field === "businessEmail") {
      if (!formData.businessEmail.trim()) newErrors.businessEmail = "Business email is required.";
      else if (!validateEmail(formData.businessEmail)) newErrors.businessEmail = "Please enter a valid email address.";
      else newErrors.businessEmail = undefined;
    } else if (field === "businessPhone") {
      if (!formData.businessPhone.trim()) newErrors.businessPhone = "Business phone is required.";
      else if (!validatePhone(formData.businessPhone)) newErrors.businessPhone = "Please enter a valid phone number.";
      else newErrors.businessPhone = undefined;
    } else if (field === "BTWNNumber") {
      newErrors.BTWNNumber = formData.BTWNNumber.trim() ? undefined : "BTW number is required.";
    }
    setErrors(newErrors);
  };
  
  const handleIndividualSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address.";
    if (!validatePhone(formData.phone)) newErrors.phone = "Please enter a valid phone number.";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Map to sheet headers (membership individual)
    const payload = {
      "first name": formData.firstName,
      "last name": formData.lastName,
      "nationality": formData.nationality,
      "id number": formData.IDNumber || "",
      "property address": formData.propertyAddress,
      "phone number": formData.phone,
      "email address": formData.email,
      "btw number": formData.BTWNNumber || "",
    };

    // Send to SheetDB (individual)
    fetch(SHEETDB_INDIVIDUAL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload }),
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || "SheetDB submission failed");
        alert("Individual registration submitted successfully.");
        // reset individual-related fields
        setFormData((prev) => ({
          ...prev,
          firstName: "",
          lastName: "",
          nationality: "",
          email: "",
          phone: "",
          propertyAddress: "",
          IDNumber: "",
          BTWNNumber: "",
        }));
        setErrors({});
      })
      .catch((err) => {
        console.error("SheetDB individual submit error:", err);
        alert("Could not submit individual registration. Please try again.");
      });
  };
  
  const handleBusinessSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validateEmail(formData.businessEmail)) newErrors.businessEmail = "Please enter a valid business email address.";
    if (!validatePhone(formData.businessPhone)) newErrors.businessPhone = "Please enter a valid business phone number.";
    if (!validatePhone(formData.phone) && formData.phone) {
      // if personal phone present for business contact (optional), validate it too
      newErrors.phone = "Please enter a valid phone number.";
    }
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Map to sheet headers (membership business)
    const payload = {
      "business name": formData.businessName,
      "registration number": formData.companyRegNumber,
      "business phone": formData.businessPhone,
      "email address": formData.businessEmail,
      "business address": formData.businessAddress,
      "po box": formData.businessPOBox,
      "btw number": formData.BTWNNumber || "",
    };

    // Send to SheetDB (business)
    fetch(SHEETDB_BUSINESS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload }),
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || "SheetDB submission failed");
        alert("Business registration submitted successfully.");
        // reset business-related fields
        setFormData((prev) => ({
          ...prev,
          businessName: "",
          companyRegNumber: "",
          businessPhone: "",
          businessEmail: "",
          businessAddress: "",
          businessPOBox: "",
          BTWNNumber: "",
        }));
        setErrors({});
      })
      .catch((err) => {
        console.error("SheetDB business submit error:", err);
        alert("Could not submit business registration. Please try again.");
      });
  };

  return (
    <div className="registration-page">
      <Navbar />

      {/* Page Header (consistent with other pages) */}
      <section className="page-header">
        <div className="registration-container">
          <h1 className="page-title">Registration</h1>
          <div className="breadcrumb">Registration</div>
        </div>
      </section>
 
       {/* Main Content */}
       
       <section className="content-section">
         <div className="registration-container">
           <div className="form-container">
             <h2 className="form-title">Apply for Membership</h2>
             <p className="form-description">
               Please complete the form below to apply for Cachet Park CID membership. We will contact you within 2-3
               business days to process your application.
             </p>

             {/* selector to show only one form */}
             <div className="form-group" style={{ marginBottom: 20 }}>
               <label className="form-label">Registering as</label>
               <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                 <label>
                   <input type="radio" name="registrationType" value="individual" checked={registrationType === "individual"} onChange={handleTypeChange} /> Individual
                 </label>
                 <label>
                   <input type="radio" name="registrationType" value="business" checked={registrationType === "business"} onChange={handleTypeChange} /> Business
                 </label>
               </div>
             </div>

             {/* Render only the selected form */}
             {registrationType === "individual" ? (
               <form className="registration-form individual-form" onSubmit={handleIndividualSubmit}>
                 <h3 className="form-subtitle">Individual Registration</h3>

                 <div className="form-row">
                   <div className="form-group">
                    <label className="form-label" htmlFor="firstName">First Names <span className="required">*</span></label>
                     <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="form-input" required />
                   </div>

                   <div className="form-group">
                     <label className="form-label" htmlFor="lastName">Last Name <span className="required">*</span></label>
                     <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="form-input" required />
                   </div>
                 </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="nationality">Nationality <span className="required">*</span></label>
                    <input type="text" id="nationality" name="nationality" value={formData.nationality} onChange={handleInputChange} className="form-input" required />
                  </div>

                 <div className="form-group">
                   <label className="form-label" htmlFor="email">Email Address <span className="required">*</span></label>
                   <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={() => handleBlur("email")} className="form-input" required />
                   {errors.email && <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>{errors.email}</div>}
                 </div>
 
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number <span className="required">*</span></label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} onBlur={() => handleBlur("phone")} className="form-input" required />
                  {errors.phone && <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>{errors.phone}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="propertyAddress">Property Address <span className="required">*</span></label>
                  <input type="text" id="propertyAddress" name="propertyAddress" value={formData.propertyAddress} onChange={handleInputChange} className="form-input" placeholder="Full street address" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="IDNumber">ID Number <span className="required">*</span></label>
                  <input type="text" id="IDNumber" name="IDNumber" value={formData.IDNumber} onChange={handleInputChange} onBlur={() => handleBlur("IDNumber")} className="form-input" placeholder="Your ID Number" required />
                  {errors.IDNumber && <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>{errors.IDNumber}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="BTWNNumber">BTW Number <span className="required">*</span></label>
                  <input type="text" id="BTWNNumber" name="BTWNNumber" value={formData.BTWNNumber} onChange={handleInputChange} className="form-input" placeholder="Your BtW Number" required />
                </div>

                {/* Additional Information removed */}

                <div style={{ display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
                  <button type="submit" className="submit-button">SUBMIT INDIVIDUAL APPLICATION</button>
                  <button
                    type="button"
                    className="clear-btn"
                    style={{ padding: "15px 30px", fontSize: "16px", marginTop: "10px", background: "none", color: "#c00" }}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        firstName: "",
                        lastName: "",
                        nationality: "",
                        email: "",
                        phone: "",
                        propertyAddress: "",
                        IDNumber: "",
                        BTWNNumber: "",
                      }));
                      setErrors({});
                    }}
                  >
                    Clear
                  </button>
                </div>
              </form>
            ) : (
              <form className="registration-form business-form" onSubmit={handleBusinessSubmit}>
                <h3 className="form-subtitle">Business Registration</h3>

                <div className="form-group">
                  <label className="form-label" htmlFor="businessName">Business Name <span className="required">*</span></label>
                  <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleInputChange} onBlur={() => handleBlur("businessName")} className="form-input" required />
                  {errors.businessName && <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>{errors.businessName}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="companyRegNumber">Company / Registration No. <span className="required">*</span></label>
                  <input type="text" id="companyRegNumber" name="companyRegNumber" value={formData.companyRegNumber} onChange={handleInputChange} className="form-input" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="businessPhone">Business Phone <span className="required">*</span></label>
                  <input type="tel" id="businessPhone" name="businessPhone" value={formData.businessPhone} onChange={handleInputChange} onBlur={() => handleBlur("businessPhone")} className="form-input" required />
                  {errors.businessPhone && <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>{errors.businessPhone}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="businessEmail">Business Email <span className="required">*</span></label>
                  <input type="email" id="businessEmail" name="businessEmail" value={formData.businessEmail} onChange={handleInputChange} onBlur={() => handleBlur("businessEmail")} className="form-input" required />
                  {errors.businessEmail && <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>{errors.businessEmail}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="businessAddress">Business Address <span className="required">*</span></label>
                  <input type="text" id="businessAddress" name="businessAddress" value={formData.businessAddress} onChange={handleInputChange} onBlur={() => handleBlur("businessAddress")} className="form-input" required />
                  {errors.businessAddress && <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>{errors.businessAddress}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="businessPOBox">PO Box <span className="required">*</span></label>
                  <input type="text" id="businessPOBox" name="businessPOBox" value={formData.businessPOBox} onChange={handleInputChange} onBlur={() => handleBlur("businessPOBox")} className="form-input" required />
                  {errors.businessPOBox && <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>{errors.businessPOBox}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="BTWNNumber">BTW Number <span className="required">*</span></label>
                  <input type="text" id="BTWNNumber" name="BTWNNumber" value={formData.BTWNNumber} onChange={handleInputChange} onBlur={() => handleBlur("BTWNNumber")} className="form-input" placeholder="Your BTW Number" required />
                  {errors.BTWNNumber && <div className="form-error" style={{ color: "#c00", marginTop: 6 }}>{errors.BTWNNumber}</div>}
                </div>

                {/* Removed Number of Employees and Type of Business */}

                {/* Additional Information removed */}

                <div style={{ display: "flex", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
                  <button type="submit" className="submit-button">SUBMIT BUSINESS APPLICATION</button>
                  <button
                    type="button"
                    className="clear-btn"
                    style={{ padding: "15px 30px", fontSize: "16px", marginTop: "10px", background: "none", color: "#c00" }}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        businessName: "",
                        companyRegNumber: "",
                        businessPhone: "",
                        businessEmail: "",
                        businessAddress: "",
                        businessPOBox: "",
                        BTWNNumber: "",
                      }));
                      setErrors({});
                    }}
                  >
                    Clear
                  </button>
                </div>
              </form>
            )}

            {/* login prompt removed */}
          </div>

          {/* Contact Information */}
        </div>
      </section>

      {/* shared footer */}
      <Footer />
    </div>
  );
}
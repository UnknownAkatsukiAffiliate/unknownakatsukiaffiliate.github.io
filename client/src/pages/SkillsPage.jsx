import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/footer.jsx";
import "./SkillsPage.css";

export default function SkillsPage() {
  const SHEETDB_SKILLS = "https://sheetdb.io/api/v1/q5n1z9x7t8k2h";
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: [],
    skillCategories: [],
    description: "",
    experience: "",
    address: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [workers, setWorkers] = useState([]);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const skillCategories = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Roofing",
    "Landscaping",
    "HVAC",
    "Welding",
    "Masonry",
    "Locksmith",
    "Automotive",
    "Appliance Repair",
    "General Maintenance",
    "Cleaning Services",
    "Security",
    "Other",
  ];

  // Fetch workers from SheetDB
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch(SHEETDB_SKILLS);
        if (response.ok) {
          const data = await response.json();
          setWorkers(data);
        }
      } catch (err) {
        console.error("Error fetching workers:", err);
      }
    };

    fetchWorkers();
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
  const validatePhone = (phone) => {
    if (!phone) return false;
    const digits = String(phone).replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleCategoryToggle = (category) => {
    setFormData((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.includes(category)
        ? prev.skillCategories.filter((c) => c !== category)
        : [...prev.skillCategories, category],
    }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (formData.skillCategories.length === 0) {
      newErrors.skillCategories = "Please select at least one skill category.";
    }

    if (formData.skills.length === 0) {
      newErrors.skills = "Please add at least one specific skill.";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Years of experience is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const dataToSubmit = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        skillCategories: formData.skillCategories.join(", "),
        skills: formData.skills.join(", "),
        experience: formData.experience,
        address: formData.address,
        description: formData.description,
        dateSubmitted: new Date().toLocaleDateString(),
      };

      const response = await fetch(SHEETDB_SKILLS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataToSubmit }),
      });

      if (response.ok) {
        setSent(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          skills: [],
          skillCategories: [],
          description: "",
          experience: "",
          address: "",
        });

        // Refresh workers list
        const refreshResponse = await fetch(SHEETDB_SKILLS);
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setWorkers(data);
        }

        setTimeout(() => setSent(false), 3000);
      } else {
        setError("Failed to submit skills. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting skills:", err);
      setError("An error occurred. Please try again.");
    }
  };

  // Filter workers
  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skillCategories?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      worker.skillCategories?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="skills-page">
      <Navbar />

      {/* Page Header */}
      <section className="page-header">
        <div className="skills-container">
          <h1 className="page-title">Skills Directory</h1>
          <p className="page-subtitle">
            Connect with skilled professionals or list your services
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="content-section">
        <div className="skills-container">
          <div className="skills-content">
            {/* Left Column - Add Skills Form */}
            <div className="skills-form-section">
              <h2 className="section-title">Add Your Skills</h2>
              <p className="section-subtitle">
                Are you a handyman or skilled professional? List your services here so customers can find you.
              </p>

              {sent && (
                <div className="success-message">
                  ✓ Your skills have been successfully added to our directory!
                </div>
              )}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form className="skills-form" onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="form-input"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                {/* Phone Field */}
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="form-input"
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                {/* Address Field */}
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Your location or service area"
                    className="form-input"
                  />
                </div>

                {/* Skill Categories - Checkboxes */}
                <div className="form-group">
                  <label className="form-label">Select Skill Categories * (select at least one)</label>
                  <div className="categories-grid">
                    {skillCategories.map((category) => (
                      <label key={category} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.skillCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="checkbox-input"
                        />
                        <span className="checkbox-text">{category}</span>
                      </label>
                    ))}
                  </div>
                  {errors.skillCategories && (
                    <span className="error-text">{errors.skillCategories}</span>
                  )}
                </div>

                {/* Specific Skills */}
                <div className="form-group">
                  <label className="form-label">Specific Skills * (add at least one)</label>
                  <div className="skill-input-group">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="e.g., Leak repair, Fixture installation"
                      className="form-input"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="add-skill-btn"
                    >
                      Add
                    </button>
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="skills-list">
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="remove-skill-btn"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {errors.skills && <span className="error-text">{errors.skills}</span>}
                </div>

                {/* Experience */}
                <div className="form-group">
                  <label className="form-label">Years of Experience *</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select experience level</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                  {errors.experience && <span className="error-text">{errors.experience}</span>}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">About You / Your Services</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell customers about your experience and services"
                    className="form-input"
                    rows="4"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn">
                  Add My Skills to Directory
                </button>
              </form>
            </div>

            {/* Right Column - Find Skills */}
            <div className="find-skills-section">
              <h2 className="section-title">Find Skilled Professionals</h2>
              <p className="section-subtitle">
                Search for professionals with specific skills in your area.
              </p>

              {/* Search Bar */}
              <div className="search-section">
                <input
                  type="text"
                  placeholder="Search by name, skill, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Category Filter */}
              <div className="filter-section">
                <label className="filter-label">Filter by Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  {skillCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Workers List */}
              <div className="workers-list">
                {filteredWorkers.length > 0 ? (
                  filteredWorkers.map((worker, index) => (
                    <div key={index} className="worker-card">
                      <div className="worker-header">
                        <h3 className="worker-name">{worker.name}</h3>
                        <span className="experience-badge">
                          {worker.experience}
                        </span>
                      </div>

                      <div className="worker-categories">
                        <strong>Categories:</strong> {worker.skillCategories}
                      </div>

                      <div className="worker-skills">
                        <strong>Skills:</strong>
                        <div className="skills-tags">
                          {worker.skills?.split(", ").map((skill, idx) => (
                            <span key={idx} className="skill-badge">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {worker.address && (
                        <div className="worker-address">
                          <strong>Location:</strong> {worker.address}
                        </div>
                      )}

                      {worker.description && (
                        <div className="worker-description">
                          <strong>About:</strong> {worker.description}
                        </div>
                      )}

                      <div className="worker-contact">
                        <a href={`mailto:${worker.email}`} className="contact-btn email-btn">
                          📧 Email
                        </a>
                        <a href={`tel:${worker.phone}`} className="contact-btn phone-btn">
                          📞 Call
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>No skilled professionals found matching your search.</p>
                    <p>Be the first to add your skills!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

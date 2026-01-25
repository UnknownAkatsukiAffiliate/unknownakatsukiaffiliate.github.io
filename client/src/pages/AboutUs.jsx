import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/footer.jsx";
import "./AboutUs.css";

// Resolve images from images folder
const bottomImg = new URL("../images/image.png", import.meta.url).href;
const managementPic = new URL("../images/manager pic.png", import.meta.url).href;

// Image collection
const galleryImages = [
  {
    src: new URL("../images/download (10).jpg", import.meta.url).href,
    alt: "Public Safety",
    title: "Public Safety",
    type: "image"
  },
  {
    src: new URL("../images/download (2).png", import.meta.url).href,
    alt: "Park Maintenance",
    title: "Park Maintenance",
    type: "image"
  },
  {
    src: new URL("../images/download (3).png", import.meta.url).href,
    alt: "Community Events",
    title: "Community Events",
    type: "image"
  },
  {
    src: new URL("../images/download (11).jpg", import.meta.url).href,
    alt: "Emergency Response",
    title: "Emergency Response",
    type: "image"
  },
  {
    src: new URL("../images/download (4).jpg", import.meta.url).href,
    alt: "Urban Development",
    title: "Urban Development",
    type: "image"
  },
  {
    src: new URL("../images/download (5).jpg", import.meta.url).href,
      alt: "CID Event Speaker",
      title: "CID Event Speaker",
    type: "image"
  },
    {
      src: new URL("../images/download (14).jpg", import.meta.url).href,
      alt: "CID Night Patrol",
      title: "CID Night Patrol",
      type: "image"
    },
    {
      src: new URL("../images/download (13).jpg", import.meta.url).href,
      alt: "CID Badge",
      title: "CID Badge",
      type: "image"
    },
  {
    src: new URL("../images/download (6).jpg", import.meta.url).href,
    alt: "Highway Safety",
    title: "Highway Safety",
    type: "image"
  },
  {
    src: new URL("../images/download (12).jpg", import.meta.url).href,
    alt: "Community Gathering",
    title: "Community Gathering",
    type: "image"
  },
  {
    src: new URL("../images/download (9) - Copy.jpg", import.meta.url).href,
    alt: "Cachet Park Sign",
    title: "Cachet Park Sign",
    type: "image"
  },
  {
    src: new URL("../images/download (7).jpg", import.meta.url).href,
    alt: "Community Space",
    title: "Community Space",
    type: "image"
  },
  {
    src: new URL("../images/download (8).jpg", import.meta.url).href,
    alt: "Park Facilities",
    title: "Park Facilities",
    type: "image"
  },
  {
    src: new URL("../images/download (4).png", import.meta.url).href,
    alt: "Safety Services",
    title: "Safety Services",
    type: "image"
  },
  {
    src: new URL("../images/Dam Park.jpg", import.meta.url).href,
    alt: "Park at Night",
    title: "Park at Night",
    type: "image"
  },
  {
    src: new URL("../images/Borchard Street.jpg", import.meta.url).href,
    alt: "Street View at Night",
    title: "Street View at Night",
    type: "image"
  },
  {
    src: new URL("../images/download.png", import.meta.url).href,
    alt: "Park Scene",
    title: "Park Scene",
    type: "image"
  },
  {
    src: new URL("../images/download (5).png", import.meta.url).href,
    alt: "Collage Image",
    title: "Collage Image",
    type: "image"
  }
];

export default function AboutUs() {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const videoRef = React.useRef(null);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      openModal(selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < galleryImages.length - 1) {
      openModal(selectedImageIndex + 1);
    }
  };

  const handleModalBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="about-page">
      <Navbar />


      {/* Page Header */}
      <section className="page-header">
        <div className="about-container">
          <h1 className="page-title">About Us</h1>
        </div>
      </section>

      {/* Background image below About Us heading */}
      <div className="about-container">
        <img
          src={new URL("../images/download.png", import.meta.url).href}
          alt="Park at night background"
          className="about-header-image"
        />
      </div>

      <main className="content-section">
        <div className="about-container">
          {/* Mission Section */}
          <section className="about-section">
            <div className="section-header">
              <h2 className="section-title">Our Mission</h2>
              <div className="section-divider"></div>
            </div>
            <div className="mission-content">
              <p className="mission-text">
                Cachet Park City Improvement District (CID) was established to create a safe, clean,
                and well-maintained urban environment that enhances property values and quality of life
                for all stakeholders. We work collaboratively with property owners, businesses, and
                local authorities to implement sustainable urban management solutions.
              </p>
            </div>
          </section>

          {/* What We Do Section */}
          <section className="about-section" style={{ marginTop: 40 }}>
            <div className="section-header">
              <h2 className="section-title">What We Do</h2>
              <div className="section-divider"></div>
            </div>
            <div className="services-grid">
              <div className="service-card">
                <h3 className="service-title">Security & Safety</h3>
                <p className="service-description">
                  Enhanced security patrols, CCTV monitoring, and emergency response services
                  to ensure a safe environment for residents and businesses.
                </p>
              </div>

              <div className="service-card">
                <h3 className="service-title">Cleaning & Maintenance</h3>
                <p className="service-description">
                  Regular street cleaning, waste management, graffiti removal, and public space
                  maintenance to uphold high standards of urban hygiene.
                </p>
              </div>

              <div className="service-card">
                <h3 className="service-title">Urban Greening</h3>
                <p className="service-description">
                  Landscape maintenance, tree planting, and green space development to create
                  an attractive and sustainable urban environment.
                </p>
              </div>

              <div className="service-card">
                <h3 className="service-title">Community Engagement</h3>
                <p className="service-description">
                  Building strong relationships with stakeholders, facilitating communication,
                  and promoting community initiatives and events.
                </p>
              </div>
            </div>
          </section>

          {/* Governance Section */}
          <section className="about-section" style={{ marginTop: 40 }}>
            <div className="section-header">
              <h2 className="section-title">Governance & Structure</h2>
              <div className="section-divider"></div>
            </div>

            <div className="governance-content">
              <div className="governance-text">
                <p>
                  The team behind the scenes is an example of how working together and working hard can lead
                  to visible change, breakthroughs, and establishing a new status quo. This team consists of
                  a non-executive board, service providers, and full-time staff.
                </p>
              </div>

              <div className="governance-grid">
                {/* Board Members */}
                <div className="board-members">
                  <h3 className="board-title">Board of Directors</h3>
                  <div className="members-list">
                    <div className="member-item"><strong>Prof. Daryl Balia</strong></div>
                    <div className="member-item"><strong>Benje Ouwencamp</strong></div>
                    <div className="member-item"><strong>Col. Des Ayob</strong></div>
                    <div className="member-item"><strong>JB MARKS</strong></div>
                  </div>
                </div>

                {/* Management */}
                <div className="management-section">
                  <h3 className="board-title">Management</h3>
                  <div
                    className="management-card"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "16px",
                      marginTop: "8px",
                      paddingLeft: 0,
                    }}
                  >
                    <img
                      src={managementPic}
                      alt="Management Placeholder"
                      className="management-photo"
                      style={{
                        width: "174px",
                        height: "291px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        margin: 0,
                      }}
                    />
                    <div className="management-info">
                      <strong>Leandro de Beer</strong>
                      <p>Manager</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Achievements Section removed */}

          {/* Contact CTA Section */}
          <section className="about-section section-bg" style={{ marginTop: 40 }}>
            <div className="cta-content">
              <h2 className="cta-title">Get Involved</h2>
              <p className="cta-text">
                Join us in making Cachet Park a better place to live, work, and do business.
                Contact us to learn more about our initiatives or to get involved in the CID's activities.
              </p>
              <div
                className="cta-actions"
                style={{ position: "relative", top: -18, display: "flex", gap: 12, alignItems: "center" }}
              >
                <a href="/contact" className="cta-btn primary">Contact Us</a>
                <a href="/services" className="cta-btn secondary">Our Services</a>
              </div>
            </div>
          </section>

          {/* Image Gallery Collection */}
          <section className="about-section" style={{ marginTop: 40 }}>
            <div className="section-header">
              <h2 className="section-title">About us in pictures</h2>
              <div className="section-divider"></div>
            </div>
            <div className="gallery-container">
              {galleryImages.map((image, index) => (
                <div key={index} className="gallery-item" onClick={() => openModal(index)}>
                  {image.type === "video" ? (
                    <>
                      <video
                        src={image.src}
                        className="gallery-image"
                      />
                      <div className="video-play-icon">▶</div>
                    </>
                  ) : (
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="gallery-image"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Image/Video Modal */}
            {selectedImageIndex !== null && (
              <div 
                className="modal-background" 
                onClick={handleModalBackgroundClick}
              >
                {/* Modal Title */}
                <div className="modal-title">About us in pictures</div>

                {/* Image Counter */}
                <div className="modal-counter">
                  {selectedImageIndex + 1} / {galleryImages.length}
                </div>

                {/* Close Button */}
                <button className="modal-close" onClick={closeModal}>✕</button>

                {/* Previous Arrow */}
                {selectedImageIndex > 0 && (
                  <button 
                    className="modal-nav-arrow modal-nav-prev"
                    onClick={goToPrevious}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                )}

                {/* Next Arrow */}
                {selectedImageIndex < galleryImages.length - 1 && (
                  <button 
                    className="modal-nav-arrow modal-nav-next"
                    onClick={goToNext}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                )}

                {galleryImages[selectedImageIndex].type === "video" ? (
                  <div className="custom-video-player">
                    <video
                      ref={videoRef}
                      src={galleryImages[selectedImageIndex].src}
                      className="modal-image"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      style={{
                        width: '90vw',
                        maxWidth: '800px',
                        height: 'auto'
                      }}
                    />
                    
                    {/* Custom Controls */}
                    <div className="video-controls">
                      {/* Progress Bar */}
                      <div 
                        className="progress-bar-container" 
                        onClick={handleProgressChange}
                      >
                        <div 
                          className="progress-bar" 
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        >
                          <div className="progress-handle"></div>
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="controls-bottom">
                        <div 
                          className="play-button"
                          onClick={togglePlayPause}
                          role="button"
                          tabIndex={0}
                        >
                          {isPlaying ? "⏸" : "▶"}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img
                    src={galleryImages[selectedImageIndex].src}
                    alt={galleryImages[selectedImageIndex].alt}
                    className="modal-image"
                  />
                )}
              </div>
            )}
          </section>

          {/* Service Providers heading above image */}
          <section className="about-section" style={{ marginTop: 32 }}>
            <div className="section-header">
              <h2 className="section-title">Service Providers</h2>
              <div className="section-divider"></div>
            </div>
          </section>

          {/* Centered image above footer */}
          <section className="about-section" style={{ marginTop: 24 }}>
            <div className="about-container">
              <img
                src={bottomImg}
                alt="Service Providers"
                className="about-bottom-image"
              />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

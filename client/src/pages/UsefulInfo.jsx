import React from "react";
import Navbar from "../components/Navbar.jsx";
import "./UsefulInfo.css";
import Footer from "../components/footer.jsx";


export default function UsefulInfo() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const testimonials = [
    { text: "Since the project of CID started here on the Bult. The Bult has been a safer place for everyone, especially our students, as well as for us workers on the Bult.", author: "Rose" },
    { text: "Ek is al 13 jaar in Potch en ek moet sê, ek kan sien wat 'n ongelooflike verskil die CID gemaak het op die bult en Potchefstroom as geheel.", author: "Charonike Nel" },
    { text: "The Bult is a place of relaxation for university students. So, it is very important that this area is clean, safe, and secured, thanks to the CID this has become a reality.", author: "Jonathan Knell" },
    { text: "I'm a student here in Potchefstroom and since the CID project started, I feel much safer on the Bult, I can also say, that the environment is much cleaner, and it makes me proud to study here.", author: "Zanté Bencsh" },
    { text: "The CID project is more than just a community project, as a student, I can personally say that what they are doing is more than just preventing littering and loitering on the Bult. It is a project that also prevents the dangers of everyday life.", author: "Righardt Hug" }
  ];

  const testimonialsPerPage = isMobile ? 2 : 3;

  const goToPreviousTestimonials = () => {
    setCurrentTestimonialIndex((prev) => Math.max(0, prev - testimonialsPerPage));
  };

  const goToNextTestimonials = () => {
    setCurrentTestimonialIndex((prev) => {
      const maxIndex = testimonials.length - testimonialsPerPage;
      return Math.min(maxIndex, prev + testimonialsPerPage);
    });
  };

  return (
    <div className="usefulinfo-page">
      <Navbar />
      
      {/* Page Header */}
      <section className="page-header">
        <div className="usefulinfo-container">
          <h1 className="page-title">Useful Information</h1>

        </div>
      </section>

      {/* Main Content */}
      <section className="content-section">
        <div className="usefulinfo-container">
          {/* Emergency Contacts */}
          <div className="info-section">
            <h2 className="section-title">Emergency Contacts</h2>
            <ul className="content-list">
              <li className="list-item"><strong>Police:</strong> 10111 / 018 299 7477</li>
              <li className="list-item"><strong>Ambulance:</strong> 10177</li>
              <li className="list-item"><strong>Fire Department / Traffic / Disaster Management:</strong> 078 803 1570</li>
              <li className="list-item"><strong>NWU Protection Services :</strong> 018 299 2215</li>
              <li className="list-item"><strong>Cachet Park  Public Safety :</strong> 073 473 2803</li>
            </ul>
          </div>

          {/* Local Services */}
          <div className="info-section">
            <h2 className="section-title">Local Services</h2>
            <p className="content-text">
              The following local services are available to residents and businesses in the Cachet Park area:
            </p>
            <ul className="content-list">
              <li className="list-item">
                <strong>Waste Removal:</strong> Weekly municipal collection.
              </li>
              <li className="list-item">
                <strong>Recycling:</strong> Use designated drop-off points.
              </li>
              <li className="list-item">
                <strong>Water & Electricity:</strong> Report outages to municipality.
              </li>
              <li className="list-item">
                <strong>Street Lighting:</strong> Report faults to CID or municipality.
              </li>
            </ul>
          </div>

          {/* Community Guidelines */}
            <div className="info-section">
              <h2 className="section-title">Community Guidelines</h2>
              <p className="content-text">Please help maintain a safe and pleasant environment:</p>
              <ul className="content-list">
                <li className="list-item">Keep property clean</li>
                <li className="list-item">Dispose of waste responsibly</li>
                <li className="list-item">Respect noise levels</li>
                <li className="list-item">Report suspicious activity</li>
                <li className="list-item">Observe parking rules</li>
                <li className="list-item">Control and clean up after pets</li>
              </ul>
            </div>

          {/* Videos */}
          <div className="info-section">
            <h2 className="section-title">Videos</h2>
            <p className="content-text">
              Watch the overview video below.
            </p>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
              <iframe
                src="https://www.youtube.com/embed/oI1tUr301x4?rel=0"
                title="CID Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              ></iframe>
            </div>
          </div>

          {/* Bult Bulletin Episodes */}
          <div className="info-section">
            <h2 className="section-title">Bult Bulletin Episodes</h2>
            <p className="content-text">
              Watch Bult Bulletin episodes on YouTube:
            </p>
            <a 
              href="https://www.youtube.com/results?search_query=bult+bulletin"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-button"
            >
              View Bult Bulletin Episodes on YouTube
            </a>
          </div>


          {/* Testimonials */}
          <div className="info-section">
            <h2 className="section-title">Testimonials</h2>
            <div className="testimonials-carousel">
              {currentTestimonialIndex > 0 && (
                <button 
                  className="testimonial-nav-arrow testimonial-nav-prev"
                  onClick={goToPreviousTestimonials}
                  aria-label="Previous testimonials"
                >
                  ‹
                </button>
              )}
              
              <div className="testimonials-container">
                {testimonials.slice(currentTestimonialIndex, currentTestimonialIndex + testimonialsPerPage).map((testimonial, index) => (
                  <div key={index} className="testimonial-item">
                    <p className="testimonial-text">
                      "{testimonial.text}"
                    </p>
                    <p className="testimonial-author">{testimonial.author}</p>
                  </div>
                ))}
              </div>

              {currentTestimonialIndex < testimonials.length - testimonialsPerPage && (
                <button 
                  className="testimonial-nav-arrow testimonial-nav-next"
                  onClick={goToNextTestimonials}
                  aria-label="Next testimonials"
                >
                  ›
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* shared footer */}
      <Footer />
    </div>
  );
}
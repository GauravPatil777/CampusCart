import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div>
    <div className="landingContainer">

      {/* HERO SECTION */}
      <section className="heroSection">
        <h1 className="heroTitle">
          Buy. Sell. Connect. <br />
          Inside Your Campus with <span>CampusCart</span>
        </h1>

        <p className="heroSubtitle">
          CampusCart is your student marketplace to buy and sell books,
          gadgets, notes, and essentials safely within your college community.
          Fast, simple, and trusted by students.
        </p>

        <div className="heroButtons">
          <button
            className="primaryBtn"
            onClick={() => navigate("/register")}
          >
            Start Free
          </button>

          <button
            className="secondaryBtn"
            onClick={() => navigate("/home")}
          >
            Browse Listings
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="featuresSection">
        <h2>Why CampusCart?</h2>

        <div className="featureGrid">
          <div className="featureCard">
            <h3>🎓 Student Only Marketplace</h3>
            <p>Trade safely within verified college students.</p>
          </div>

          <div className="featureCard">
            <h3>⚡ Fast Listings</h3>
            <p>Post items in seconds and start selling instantly.</p>
          </div>

          <div className="featureCard">
            <h3>💬 Direct Chat</h3>
            <p>Connect directly with buyers and sellers easily.</p>
          </div>

          <div className="featureCard">
            <h3>🔒 Safe & Trusted</h3>
            <p>Built for secure campus-to-campus trading.</p>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="ctaSection">
        <h2>Ready to start trading smarter?</h2>
        <p>Join thousands of students already using CampusCart.</p>

        <button
          className="primaryBtn bigBtn"
          onClick={() => navigate("/register")}
        >
          Start Free
        </button>
      </section>

    </div>
    </div>
  );
};

export default Landing;
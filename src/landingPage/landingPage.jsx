import React, { useState } from "react";
import {
  FaBuilding,
  FaCog,
  FaChartLine,
  FaHeadset,
  FaUser,
  FaCoffee,
} from "react-icons/fa";

const companyLogos = [
  {
    name: "Twitch",
    src: "twitch-twitch-tv-icon-logo-png-9.png",
  },
  {
    name: "Netflix",
    src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  },
  {
    name: "Pinterest",
    src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png",
  },
  {
    name: "UFC",
    src: "images.png",
  },
  {
    name: "Xbox Series X",
    src: "Xbox_(app)-Logo.wine.png",
  },
  {
    name: "Universal",
    src: "Universal_Pictures_logo.svg",
  },
  {
    name: "Premier League",
    src: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
  },
  {
    name: "Varsity Vibe",
    src: "Varsity_Vibe__Logo-15_5d657cf8-5429-472e-84d2-2319722bc084_1105x.webp",
  },
  {
    name: "The Barcelona Exhibition",
    src: "fc-barcelona-logo-on-transparent-background-free-vector.jpg",
  },
  {
    name: "Spotify",
    src: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  },
];

const faqs = [
  {
    question: "Is FluxAudit suitable for startups?",
    answer: "Absolutely! FluxAudit scales with your growth and fits small to large businesses.",
  },
  {
    question: "Do I need accounting experience?",
    answer: "Not at all. We made FluxAudit simple and intuitive for everyone to use.",
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes, we use bank-level encryption and follow data privacy standards.",
  },
  {
    question: "Can I connect other platforms?",
    answer: "Yes! We integrate with QuickBooks, Xero, Google Sheets, and more.",
  },
  {
    question: "Is customer support included?",
    answer: "Yes. 24/7 dedicated support via chat and email is included in all plans.",
  },
];

const pricingPlans = {
  monthly: [
    {
      name: "Standard",
      price: 29,
      features: [
        "Basic financial reporting",
        "Transaction tracking",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: 59,
      features: [
        "All Standard features",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
      ],
    },
  ],
  yearly: [
    {
      name: "Standard",
      price: 290, // 2 months free
      features: [
        "Basic financial reporting",
        "Transaction tracking",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: 590, // 2 months free
      features: [
        "All Standard features",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
      ],
    },
  ],
};

const LandingPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      <style>{`
        @keyframes slideInUp {
          0% { transform: translateY(60px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes popIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .animate-slide { animation: slideInUp 0.7s ease-out forwards; }
        .animate-pop { animation: popIn 0.6s ease-out forwards; }
        .animate-fade { animation: fadeIn 1s ease-in-out; }

        .icon-box {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 120px;
          border-radius: 0.75rem;
          background: linear-gradient(to bottom right, #4f46e5, #9333ea);
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
        }
        .icon-box:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 30px rgba(147, 51, 234, 0.4);
        }

        .nav-link {
          transition: color 0.3s ease;
          font-weight: 600;
          color: #1e3a8a;
          padding: 0.25rem 0.5rem;
        }
        .nav-link:hover {
          color: #6366f1;
        }

        .hero-button, .login-button {
          background-color: #6366f1;
          color: white;
          transition: background-color 0.3s ease, transform 0.3s ease;
          border: none;
          cursor: pointer;
          padding: 0.75rem 1.5rem;
          border-radius: 0.375rem;
          font-weight: 600;
        }
        .hero-button:hover, .login-button:hover {
          background-color: #4f46e5;
          transform: scale(1.05);
        }

        .section-heading {
          font-size: 2.7rem;
          font-weight: bold;
          margin-bottom: 1.2rem;
          color: #1e3a8a;
          text-align: center;
        }
        .section-sub {
          font-size: 1.15rem;
          color: #4b5563;
          margin-bottom: 2rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .description-text {
          color: #374151;
          font-size: 1.1rem;
          max-width: 22rem;
          margin: 0 auto;
          line-height: 1.5;
        }

        .benefit-icon {
          font-size: 3.5rem;
          color: #6366f1;
          margin-bottom: 0.8rem;
        }

        /* Marquee for logos */
        .logo-scroll-wrapper {
          overflow: hidden;
          position: relative;
          width: 100%;
          height: 70px;
          margin-top: 2.5rem;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }

        .logo-scroll-content {
          display: flex;
          width: 200%; /* doubled for seamless scroll */
          animation: marquee 20s linear infinite;
          align-items: center;
        }

        .logo-item {
          flex: 0 0 auto;
          width: 150px;
          margin-right: 2.5rem;
        }

        .logo-item img {
          max-height: 50px;
          object-fit: contain;
          filter: grayscale(0.6);
          transition: all 0.3s ease;
        }
        .logo-item img:hover {
          filter: grayscale(0);
          transform: scale(1.1);
        }

        /* FAQ cards */
        .faq-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          gap: 1.25rem;
          margin-top: 2rem;
        }

        .faq-card {
          background-color: white;
          padding: 1.5rem 1.75rem;
          border-radius: 0.75rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          user-select: none;
          width: 100%;
          max-width: 600px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: left;
        }
        .faq-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }

        .faq-question {
          font-size: 1.125rem;
          font-weight: 600;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          user-select: none;
        }
        .faq-icon {
          transition: transform 0.3s ease;
          font-size: 1.5rem;
          color: #6366f1;
          user-select: none;
          margin-left: 1rem;
          flex-shrink: 0;
        }
        .faq-icon.open {
          transform: rotate(45deg);
        }

        .faq-answer {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.5s ease, opacity 0.5s ease;
          margin-top: 0.5rem;
          color: #374151;
          font-size: 1rem;
          line-height: 1.4;
        }
        .faq-answer.open {
          max-height: 200px;
          opacity: 1;
        }

        /* Pricing Section */
        .pricing-section {
          background-color: #f9fafb;
          padding: 4rem 2rem;
          text-align: center;
        }

        .billing-toggle {
          display: inline-flex;
          background: #e0e7ff;
          border-radius: 9999px;
          padding: 0.25rem;
          margin-bottom: 3rem;
          user-select: none;
          cursor: pointer;
          width: max-content;
          margin-left: auto;
          margin-right: auto;
        }

        .billing-option {
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          color: #4b5563;
          transition: background-color 0.3s ease, color 0.3s ease;
          user-select: none;
        }
        .billing-option.active {
          background-color: #4f46e5;
          color: white;
        }
        .billing-option:not(.active):hover {
          background-color: #c7d2fe;
          color: #3730a3;
        }

        .pricing-cards {
          display: flex;
          justify-content: center;
          gap: 2.5rem;
          flex-wrap: wrap;
        }

        .pricing-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          width: 280px;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.3s ease;
          cursor: default;
        }
        .pricing-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }

        .plan-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: #4f46e5;
          margin-bottom: 0.75rem;
        }
        .plan-price {
          font-size: 2.8rem;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 1rem;
        }
        .plan-price small {
          font-size: 1rem;
          font-weight: 500;
          color: #6b7280;
        }

        .plan-features {
          list-style-type: none;
          padding: 0;
          margin: 1rem 0 2rem 0;
          color: #374151;
          text-align: left;
          width: 100%;
        }
        .plan-features li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .plan-features li:last-child {
          border-bottom: none;
        }

        .choose-button {
          background-color: #6366f1;
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
          width: 100%;
        }
        .choose-button:hover {
          background-color: #4f46e5;
        }

        /* Hero section */
        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 5rem 2.5rem 4rem 2.5rem;
          gap: 3rem;
          animation: slideInUp 0.7s ease-out forwards;
          position: relative;
        }
        @media (min-width: 768px) {
          .hero-section {
            flex-direction: row;
            padding: 5rem 10rem 4rem 10rem;
            gap: 6rem;
          }
        }
        .hero-text {
          max-width: 600px;
          text-align: center;
          z-index: 2;
        }
        @media (min-width: 768px) {
          .hero-text {
            text-align: left;
          }
        }
        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1rem;
          position: relative;
          z-index: 2;
        }
        @media (min-width: 768px) {
          .hero-title {
            font-size: 5.5rem;
          }
        }
        .hero-title span {
          color: #4f46e5;
        }
        .hero-description {
          font-size: 1.6rem;
          color: #4b5563;
          margin-bottom: 2rem;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 2;
        }
        @media (min-width: 768px) {
          .hero-description {
            margin-left: 0;
            margin-right: 0;
          }
        }
        .hero-image {
          width: 100%;
          max-width: 900px;
          height: auto;
          border-radius: 1rem;
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
          animation: popIn 0.6s ease-out forwards;
          position: relative;
          top: -40px; /* moved up */
          left: 60px; /* pushed right */
          z-index: 1;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .hero-title {
            font-size: 3rem;
          }
          .hero-description {
            font-size: 1.25rem;
          }
          .hero-image {
            top: 0;
            left: 0;
          }
        }
      `}</style>

      {/* Navbar */}
      <nav className="w-full flex justify-between items-center py-6 px-10 shadow-md bg-white sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-wide text-indigo-700 cursor-pointer">fluxAudit</div>
        <div className="space-x-8 text-lg flex">
          {/* Updated links to match page sections */}
          
          
          <a href="#why-fluxaudit" className="nav-link">Why FluxAudit</a>
          <a href="#clients" className="nav-link">Clients</a>
          <a href="#faqs" className="nav-link">FAQs</a>
          <a href="#accounts-pricing" className="nav-link">Pricing</a>
        </div>
        <div className="space-x-4 flex">
          <button className="login-button">Log In</button>
          <button className="hero-button">Sign Up</button>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="hero-section"
        aria-label="Hero section with main headline, description, and image"
        id="community"
      >
        <div className="hero-text">
          <h1 className="hero-title">
            Switch to <br />
            <span>FluxAudit and</span> <br />
            launch faster.
          </h1>
          <p className="hero-description">
            Revolutionize your financial operations with intelligent automation and real-time insights.
          </p>
          <button className="hero-button" aria-label="Get started with FluxAudit">Get Started</button>
        </div>
        <div>
          <img
            className="hero-image"
            src="audit.webp"
            alt="Accounting visual with calculator and charts"
          />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-10 py-24 bg-gray-50 animate-slide">
        <div className="text-center mb-16">
          <h2 className="section-heading">How It Works</h2>
          <p className="section-sub">Three simple steps to streamline your auditing process.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 text-center">
          {[
            {
              title: "Set up your organization",
              icon: <FaBuilding className="text-white text-6xl" />,
              description: "Create your company's profile, connect financial accounts and configure your chart of accounts in minutes.",
            },
            {
              title: "Automate transactions & compliance",
              icon: <FaCog className="text-white text-6xl" />,
              description: "FluxAudit automatically records transactions, categorizes expenses, and monitors compliance in real time.",
            },
            {
              title: "Gain insights & take action",
              icon: <FaChartLine className="text-white text-6xl" />,
              description: "Access dashboards, spot anomalies, generate reports, and make data driven decisions that improve financial health.",
            },
          ].map((item, index) => (
            <div key={index}>
              <div className="icon-box">{item.icon}</div>
              <p className="font-semibold text-indigo-700 text-lg mb-2">{item.title}</p>
              <p className="description-text">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* More Than Just Software */}
      <section id="more-than-software" className="px-10 py-20 bg-white animate-fade">
        <h2 className="section-heading">More Than Just Software</h2>
        <p className="section-sub max-w-4xl mx-auto mb-12">
          At FluxAudit, we provide not only cutting-edge technology but also expert support, training, and custom solutions to fit your unique needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto text-center">
          <div>
            <FaHeadset className="benefit-icon mx-auto" />
            <h3 className="font-semibold text-indigo-700 mb-2">Dedicated Customer Support</h3>
            <p className="text-gray-700 max-w-xs mx-auto">
              24/7 live chat and email support to assist you anytime.
            </p>
          </div>
          <div>
            <FaUser className="benefit-icon mx-auto" />
            <h3 className="font-semibold text-indigo-700 mb-2">Expert Training</h3>
            <p className="text-gray-700 max-w-xs mx-auto">
              Hands-on training sessions to get your team up and running quickly.
            </p>
          </div>
          <div>
            <FaCoffee className="benefit-icon mx-auto" />
            <h3 className="font-semibold text-indigo-700 mb-2">Custom Solutions</h3>
            <p className="text-gray-700 max-w-xs mx-auto">
              Tailored workflows and integrations that fit your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Why FluxAudit */}
      <section id="why-fluxaudit" className="px-10 py-24 bg-white animate-fade">
        <h2 className="section-heading">Why FluxAudit</h2>
        <p className="section-sub max-w-3xl mx-auto mb-10">
          FluxAudit is trusted by businesses worldwide to provide seamless automation, unparalleled accuracy, and comprehensive financial oversight—all designed to help your company thrive.
        </p>
        <div className="flex justify-center mt-12">
          <img
            src="https://images.unsplash.com/photo-1555529669-c58e254f79c2?auto=format&fit=crop&w=1200&q=80"
            alt="FluxAudit Dashboard"
            className="w-full max-w-6xl rounded-xl shadow-xl"
          />
        </div>
      </section>

      {/* Clients */}
      <section id="clients" className="px-10 py-20 animate-fade">
        <h2 className="section-heading">Don&apos;t just take our word for it</h2>
        <p className="section-sub">We proudly work with world-class brands who trust us daily.</p>

        {/* Marquee Logo Carousel */}
        <div className="logo-scroll-wrapper">
          <div className="logo-scroll-content" aria-label="Trusted company logos">
            {[...companyLogos, ...companyLogos].map(({ name, src }, idx) => (
              <div key={idx} className="logo-item" title={name}>
                <img src={src} alt={`${name} logo`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="px-10 py-24 bg-gray-50">
        <h2 className="section-heading">Frequently Asked Questions</h2>
        <p className="section-sub">Get quick answers to your questions about FluxAudit.</p>
        <div className="faq-section">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="faq-card"
                onClick={() => toggleFAQ(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") toggleFAQ(idx);
                }}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                aria-labelledby={`faq-question-${idx}`}
              >
                <div id={`faq-question-${idx}`} className="faq-question">
                  {faq.question}
                  <span className={`faq-icon ${isOpen ? "open" : ""}`} aria-hidden="true">+</span>
                </div>
                <div
                  id={`faq-answer-${idx}`}
                  className={`faq-answer ${isOpen ? "open" : ""}`}
                  role="region"
                  aria-live="polite"
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="accounts-pricing" className="pricing-section">
        <h2 className="section-heading mb-4">Choose Your Plan</h2>
        <div className="billing-toggle" role="group" aria-label="Toggle billing cycle">
          <button
            type="button"
            className={`billing-option ${billingCycle === "monthly" ? "active" : ""}`}
            onClick={() => setBillingCycle("monthly")}
            aria-pressed={billingCycle === "monthly"}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            className={`billing-option ${billingCycle === "yearly" ? "active" : ""}`}
            onClick={() => setBillingCycle("yearly")}
            aria-pressed={billingCycle === "yearly"}
          >
            Yearly Billing
          </button>
        </div>

        <div className="pricing-cards">
          {pricingPlans[billingCycle].map(({ name, price, features }, i) => (
            <div key={i} className="pricing-card" tabIndex={0} aria-label={`${name} plan`}>
              <div className="plan-name">{name}</div>
              <div className="plan-price">
                ${price}
                <small>/{billingCycle === "monthly" ? "mo" : "yr"}</small>
              </div>
              <ul className="plan-features">
                {features.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
              <button className="choose-button">Choose {name}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="cut-costs text-center bg-white px-10 py-24">
        <h2 className="section-heading mb-6">Cut Costs, Not Corners</h2>
        <p className="section-sub max-w-xl mx-auto mb-10">
          Automate financial ops and compliance to reduce overhead, avoid penalties, and focus on scaling.
        </p>
        <button className="hero-button px-8 py-4 rounded-md text-lg">Learn More</button>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-6 border-t mt-10 text-sm">
        &copy; {new Date().getFullYear()} fluxAudit. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;

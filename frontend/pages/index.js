import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import API_URL from "../utils/api";

export default function Home() {
  const router = useRouter();
  const [showBirthday, setShowBirthday] = useState(false);
  const [userName, setUserName] = useState("");
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) return;
  const email =
  localStorage.getItem("userEmail");

const savedProfile =
  JSON.parse(
    localStorage.getItem(
      `profileData_${email}`
    )
  );

if (!savedProfile?.dob) return;
  const today = new Date();
  const todayDate = today.toISOString().slice(5, 10);
  const dobDate = savedProfile.dob.slice(5, 10);

  if (todayDate === dobDate) {

    setShowBirthday(true);
    setUserName(savedProfile.name);
    const timer = setTimeout(() => {
      setShowBirthday(false);

    }, 7000);

    return () => clearTimeout(timer);

  }

}, []);

useEffect(() => {

  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }

  const email = localStorage.getItem("userEmail");
  const registerVisitor = async () => {

    try {

      const res =
        await fetch(
          `${API_URL}/track-visitor`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              deviceId,

              email:
                localStorage.getItem(
                  "isLoggedIn"
                )
                ? email
                : null
            })
          }
        );

      const data =
        await res.json();

      setVisitorCount(
        data.totalVisitors
      );

    } catch (err) {

      console.error(err);

    }

  };

  registerVisitor();

}, []);

useEffect(() => {

  const interval =
    setInterval(
      async () => {

        try {

          const res =
            await fetch(
              `${API_URL}/visitor-count`
            );

          const data =
            await res.json();

          setVisitorCount(
            data.totalVisitors
          );

        } catch (err) {

          console.error(err);

        }

      },
      10000
    );

  return () =>
    clearInterval(interval);

}, []);

  return (
    <>
    {
  showBirthday && (

    <div className="birthday-overlay">

      <h1 className="birthday-text">
        🎉 Happy Birthday {userName}! 🎂
      </h1>

      <div className="balloons">
        🎈 🎈 🎈 🎈 🎈
      </div>

      <div className="sprinkles">
        ✨ ✨ ✨ ✨ ✨
      </div>

    </div>

  )
}
      <Navbar />

      {/* HERO SECTION */}
      <div className="hero">
        <h1>AI Powered Truth & Legal Assistant</h1>
        <p>Detect fake news & get reliable legal help and answers instantly</p>

        <div className="hero-btns">
          <button className="btn" onClick={() => router.push('/fact-check')}>
            Fake News Detection
          </button>

          <button className="btn" onClick={() => router.push('/legal')}>
            Bail Prediction
          </button>

          <button className="btn" onClick={() => router.push('/constitutional-qa')}>
            Constitutional Q&A Assistant
          </button>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="features">

        <div className="feature">
          <div className="feature-icon">📰</div>
          <h3>Fake News Detection</h3>
          <p>Analyze and verify news instantly</p>
        </div>

        <div className="feature">
          <div className="feature-icon">⚖️</div>
          <h3>Legal Assistant</h3>
          <p>Get AI-powered legal insights</p>
        </div>

        <div className="feature">
          <div className="feature-icon">📄</div>
          <h3>File Upload</h3>
          <p>Analyze documents easily</p>
        </div>

      </div>

      {/* ================= STATS SECTION ================= */}

      <section className="stats-section">

        <div className="stat-card">
          <h2>AI Powered</h2>
          <p>
            Advanced machine learning models for legal and news analysis.
          </p>
        </div>

        <div className="stat-card">
          <h2>Fast Analysis</h2>
          <p>
            Get instant results for fake news detection and legal guidance.
          </p>
        </div>

        <div className="stat-card">
          <h2>Secure Platform</h2>
          <p>
            Your uploaded documents and conversations remain protected.
          </p>
        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="workflow-section">

        <h2 className="section-title">
          How VeriLex AI Works
        </h2>

        <div className="workflow-grid">

          <div className="workflow-card">
            <div className="workflow-number">1</div>

            <h3>Enter News or Query</h3>

            <p>
              Paste any news headline, article, or legal question.
            </p>
          </div>

          <div className="workflow-card">
            <div className="workflow-number">2</div>

            <h3>AI Processing</h3>

            <p>
              Our AI analyzes the content using NLP and ML models.
            </p>
          </div>

          <div className="workflow-card">
            <div className="workflow-number">3</div>

            <h3>Get Results</h3>

            <p>
              Receive AI-generated insights and verification instantly.
            </p>
          </div>

        </div>

      </section>

      {/* ================= WHY CHOOSE US ================= */}

      <section className="why-section">

        <h2 className="section-title">
          Why Choose VeriLex AI
        </h2>

        <div className="why-grid">

          <div className="why-card">
            <h3>Modern AI Technology</h3>

            <p>
              Uses Natural Language Processing and Machine Learning
              techniques for intelligent analysis.
            </p>
          </div>

          <div className="why-card">
            <h3>Simple User Experience</h3>

            <p>
              Clean and intuitive interface designed for easy usage.
            </p>
          </div>

          <div className="why-card">
            <h3>Multi Functional Platform</h3>

            <p>
              Combines fake news verification, legal assistance,
              and document analysis in one platform.
            </p>
          </div>

        </div>

      </section>

      {/* ================= CTA SECTION ================= */}

      <section className="cta-section">

        <h2>
          Experience AI Powered Truth & Legal Assistance
        </h2>

        <p>
          Start exploring VeriLex AI and analyze information smarter.
        </p>

        <button
          className="btn"
          onClick={() => router.push('/fact-check')}
        >
          Get Started
        </button>

      </section>
<div className="visitor-counter">

  Total Visitors:

  {" "}

  {visitorCount
    .toString()
    .padStart(4, "0")}

</div>

    </>
  );
}
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <>
      <Navbar />

      <div className="info-page">
        <div className="info-hero-card">
          <p className="info-badge">About VeriLex AI</p>
          <h1 className="info-heading">Building trust through AI-powered verification and legal intelligence</h1>
          <p className="info-description">
            VeriLex AI is an intelligent platform designed to help users detect fake news
            and receive AI-assisted legal support in a simple, fast, and accessible way.
            It combines modern web technologies, machine learning models, and a clean user
            experience to make critical information analysis easier for everyone.
          </p>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">📰</div>
            <h3>Fake News Detection</h3>
            <p>
              Analyze suspicious news text or uploaded documents to identify whether the
              content is likely fake or real using trained machine learning models.
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">⚖️</div>
            <h3>Legal Assistance</h3>
            <p>
              Get support for legal text analysis and bail-related prediction through an
              intuitive interface designed for clarity and speed.
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">📂</div>
            <h3>Smart File Support</h3>
            <p>
              Upload supported documents such as TXT, PDF, and DOCX files so the system can
              extract text and provide AI-driven analysis.
            </p>
          </div>
        </div>

        <div className="info-section">
          <div className="info-section-card">
            <h2>Our Vision</h2>
            <p>
              We aim to create a trustworthy digital assistant that empowers users to fight
              misinformation and access intelligent legal guidance through an elegant and
              practical platform.
            </p>
          </div>

          <div className="info-section-card">
            <h2>Why VeriLex AI?</h2>
            <ul className="info-list">
              <li>Modern and user-friendly interface</li>
              <li>Machine learning powered analysis</li>
              <li>Fast fact-checking workflow</li>
              <li>Legal support through AI-driven prediction</li>
              <li>Secure login and personalized experience</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
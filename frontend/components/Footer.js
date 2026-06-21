import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaEnvelope
} from "react-icons/fa";

import { useRouter } from "next/router";

export default function Footer() {

  const router = useRouter();

  return (

    <footer className="footer">

      <div className="footer-container">

        {/* LEFT SECTION */}
        <div className="footer-brand">

          <h2>VeriLex AI</h2>

          <p>
            AI-powered fake news detection and legal
            assistance platform designed to help users
            identify misinformation and receive smart
            legal guidance instantly.
          </p>

          <div className="footer-socials">

            <a
              href="https://github.com/"
              target="_blank"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com/"
              target="_blank"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://instagram.com/"
              target="_blank"
            >
              <FaInstagram />
            </a>

            <a
                href="https://facebook.com/"
                target="_blank"
                >
                <FaFacebookF />
                </a>

            <a
              href="https://twitter.com/"
              target="_blank"
            >
              <FaTwitter />
            </a>

            <a
              href="mailto:support@verilexai.com"
            >
              <FaEnvelope />
            </a>

          </div>

        </div>


        {/* QUICK LINKS */}
        <div className="footer-links">

          <h3>Quick Links</h3>

          <span onClick={() => router.push('/')}>
            Home
          </span>

          <span onClick={() => router.push('/faq')}>
            FAQs
          </span>

          <span onClick={() => router.push('/about')}>
            About Us
          </span>

          <span onClick={() => router.push('/contact')}>
            Contact
          </span>

        </div>


        {/* SERVICES */}
        <div className="footer-links">

          <h3>Services</h3>

          <span
            onClick={() => router.push('/fact-check')}
          >
            Fake News Detection
          </span>

          <span
            onClick={() => router.push('/legal')}
          >
            Legal Assistant
          </span>

          <span>
            Document Analysis
          </span>

          <span>
            AI Verification
          </span>

        </div>


        {/* LEGAL */}
        <div className="footer-links">

          <h3>Legal</h3>

          <span>Privacy Policy</span>

          <span>Terms & Conditions</span>

          <span>Security</span>

          <span>Support</span>

        </div>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>
          © 2026 VeriLex AI. All rights reserved.
        </p>

      </div>

    </footer>

  );
}
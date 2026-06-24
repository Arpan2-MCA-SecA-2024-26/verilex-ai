import { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import API_URL from "../utils/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('info');

  const openDialog = (msg, type = 'info') => {
    setDialogMessage(msg);
    setDialogType(type);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      openDialog(
        'Please verify CAPTCHA first.',
        'error'
      );
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      openDialog('Please fill in all fields.', 'warning');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/contact-message`,
        {
          ...formData,
          captcha: captchaToken
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      openDialog(
        res.data.message || 'Your message has been sent successfully.',
        'success'
      );

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setCaptchaToken("");
    } catch (err) {
      openDialog(
        err.response?.data?.message || 'Something went wrong while sending your message.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="info-page">
        <div className="info-hero-card">
          <p className="info-badge">Contact Us</p>
          <h1 className="info-heading">We would love to hear from you</h1>
          <p className="info-description">
            Have a question, feedback, collaboration idea, or support request?
            Reach out to us through the contact details below and we will get back
            to you as soon as possible.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <div className="info-icon">📧</div>
            <h3>Email</h3>
            <p>support.verilexai@gmail.com</p>
            <span>For support, queries, and collaborations</span>
          </div>

          <div className="contact-card">
            <div className="info-icon">📞</div>
            <h3>Phone</h3>
            <p>+91-9876543210</p>
            <span>Available during standard working hours</span>
          </div>

          <div className="contact-card">
            <div className="info-icon">📍</div>
            <h3>Location</h3>
            <p>India</p>
            <span>Serving users digitally from anywhere</span>
          </div>
        </div>

        <div className="contact-form-card">
          <h2>Send a Message</h2>
          <p className="contact-subtext">
            Fill out the form below and your message will be stored securely in our system.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
            />

            <textarea
              rows="6"
              name="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
            ></textarea>

            <div className="recaptcha-box">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {showDialog && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div
            className={`dialog-box ${dialogType}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {dialogType === 'success' && 'Success'}
              {dialogType === 'warning' && 'Notice'}
              {dialogType === 'error' && 'Error'}
              {dialogType === 'info' && 'Message'}
            </h3>

            <p>{dialogMessage}</p>

            <button className="dialog-btn" onClick={closeDialog}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
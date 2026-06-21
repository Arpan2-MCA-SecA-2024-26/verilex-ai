import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function FAQ() {

  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [

{
question: "How does fake news detection work?",
answer:
"VeriLex AI analyzes news content through a multi-layer verification pipeline that combines Natural Language Processing (NLP), claim extraction, entity recognition, trusted source verification, semantic similarity analysis, and AI-based reasoning. The system compares information with reliable sources and fact-checking databases before generating a confidence score."
},

{
question: "What is the confidence score shown in fake news detection?",
answer:
"The confidence score represents how strongly the system believes a news claim is real, fake, or unverified based on available evidence. It is calculated using multiple verification stages and helps users understand the reliability of the prediction."
},

{
question: "What sources are used to verify news claims?",
answer:
"The platform checks information using trusted news sources, fact-checking services, semantic similarity matching, and AI-assisted verification. Evidence and source references are displayed whenever relevant information is found."
},

{
question: "Can VeriLex AI detect newly emerging fake news?",
answer:
"Yes. The system performs live verification using external information sources and AI reasoning. Even when a claim is not present in a database, VeriLex AI attempts to evaluate credibility based on available evidence and contextual analysis."
},

{
question: "What is the Constitutional Q&A Assistant?",
answer:
"The Constitutional Q&A Assistant helps users understand constitutional provisions, fundamental rights, duties, legal principles, and governance-related topics in simplified language. It is designed to make constitutional knowledge more accessible to students and citizens."
},

{
question: "Can the Constitutional Assistant answer legal questions?",
answer:
"Yes. It can explain constitutional concepts, articles, amendments, and legal terminology in an easy-to-understand manner. However, it should be used as an educational resource and not as a substitute for professional legal advice."
},

{
question: "What is the Bail Prediction module?",
answer:
"The Bail Prediction module uses machine learning techniques to estimate the likelihood of bail approval based on case-related information. The prediction is intended for research and educational purposes and should not be considered an official legal decision."
},

{
question: "How accurate is the Bail Prediction system?",
answer:
"The prediction is generated using trained machine learning models and historical patterns. While the system can identify trends and provide useful insights, actual court decisions depend on numerous legal and case-specific factors."
},

{
question: "Can I upload files for analysis?",
answer:
"Yes. Users can upload supported documents such as PDF, DOCX, and text files. The system extracts relevant content and performs AI-powered analysis to generate insights, verification results, and explanations."
},

{
question: "Does VeriLex AI provide explanations for its predictions?",
answer:
"Yes. When Explainable AI (XAI) mode is enabled, the platform provides detailed reasoning behind predictions. This helps users understand which factors and evidence influenced the final decision."
},

{
question: "Can I generate reports from analysis results?",
answer:
"Yes. Users can download professionally formatted PDF reports containing the analyzed content, prediction results, confidence scores, and explanations for future reference or documentation."
},

{
question: "Can I use VeriLex AI without creating an account?",
answer:
"Some informational pages can be accessed without registration. However, features such as profile management, history tracking, file uploads, and personalized services may require users to log in."
},

{
question: "Why should I complete my profile?",
answer:
"Completing your profile helps personalize your experience and enables features such as profile-based settings, birthday greetings, account management, and improved user engagement throughout the platform."
},

{
question: "Is my uploaded data secure?",
answer:
"VeriLex AI is designed with privacy and security considerations in mind. Uploaded files and user information are processed securely and are not publicly shared or exposed to other users."
},

{
question: "Does VeriLex AI provide official legal advice?",
answer:
"No. VeriLex AI provides AI-generated insights, educational explanations, and informational guidance only. Users should consult qualified legal professionals for official legal advice or representation."
},

{
question: "What technologies are used in VeriLex AI?",
answer:
"The platform is built using Next.js, React, Flask, MySQL, Natural Language Processing (NLP), Machine Learning models, Explainable AI techniques, and modern web technologies for a responsive user experience."
},

{
question: "Does the platform work on mobile devices?",
answer:
"Yes. VeriLex AI is fully responsive and optimized for desktops, tablets, and smartphones, allowing users to access its features conveniently across different devices."
}

];


  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />

      <div className="faq-page">

        {/* HERO */}
        <div className="faq-hero">

          <div className="faq-badge">
            Frequently Asked Questions
          </div>

          <h1>
            Everything You Need To Know About VeriLex AI
          </h1>

          <p>
            Explore answers related to fake news detection, legal AI assistance, security, uploads, and platform usage.
          </p>

        </div>

        

        {/* FAQ SECTION */}

        <div className="faq-container">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className={`faq-card ${
                openIndex === index ? 'active' : ''
              }`}
            >

              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >

                <span>{faq.question}</span>

                <span className="faq-icon">
                  {openIndex === index ? '−' : '+'}
                </span>

              </button>

              <div
                className={`faq-answer ${
                  openIndex === index ? 'show' : ''
                }`}
              >

                <p>{faq.answer}</p>

              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  );
}
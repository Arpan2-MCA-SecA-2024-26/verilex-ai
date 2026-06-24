import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";
import { saveToHistory } from "../utils/saveHistory";
import API_URL from "../utils/api";

export default function ConstitutionalQA() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const fileInputRef = useRef(null);

  const askQuestion = async () => {

    if (!question.trim()) return;

    setLoading(true);

    try {

      const userEmail = localStorage.getItem("userEmail");
      const response = await fetch(
        `${API_URL}/ask-constitution`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
            email: userEmail
          }),
        }
      );

      const data = await response.json();

      setAnswer(data.answer);

      saveToHistory(
  "Constitutional Q&A",
  question,
  "Question Answered",
  100,
  data.answer
);

    } catch (error) {

      console.error(error);

      setAnswer(
        "Unable to connect to backend."
      );

    }

    setLoading(false);
  };

  const openDialog = (msg) => {setDialogMessage(msg);
  setShowDialog(true);
};

const closeDialog = () => {setShowDialog(false);};

 const handleUploadClick = () => {

  const user =
    typeof window !== "undefined"
      ? localStorage.getItem("userName")
      : null;

  if (!user) {

    openDialog(
      "Please login first to use file upload."
    );

    return;
  }

  fileInputRef.current.click();
};

const handleFileChange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const userEmail = localStorage.getItem("userEmail");

const formData = new FormData();
formData.append("file", file);

formData.append(
  "email",
  userEmail
);

  try {
    setLoading(true);

    const response = await fetch(
      `${API_URL}/constitution-upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    setQuestion(data.extracted_text || "");
    setAnswer(data.answer || "");
saveToHistory(
  "Constitutional Q&A",
  data.extracted_text || file.name,
  "Question Answered",
  100,
  data.answer || ""
);

  } catch (error) {
    console.error(error);
    setAnswer("File upload failed.");
  }

  setLoading(false);
};
  
  return (
    <>
      <Navbar />

      <div className="center-page">

        <div className="card">

          <h2 className="title">
            ⚖️ Constitutional Q&A Assistant
          </h2>

          <p className="sub">
            Ask any question regarding the Constitution of India.
          </p>

          <textarea
            rows={8}
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Example:
What is Article 21?

What are Fundamental Rights?

Difference between Article 14 and Article 21?"
          />
<input
  type="file"
  ref={fileInputRef}
  style={{ display: "none" }}
  accept=".txt,.pdf,.doc,.docx"
  onChange={handleFileChange}
/>
          <div className="hero-btns">

  <button
    className="btn"
    onClick={askQuestion}
    disabled={loading}
  >
    {loading ? "Generating..." : "Ask Question"}
  </button>
   <button
    className="btn"
    onClick={handleUploadClick}
    disabled={loading}
    type="button"
  >
    Upload File
  </button>
</div>

          <div className="result">

  {
    answer ? (
      <div className="markdown-answer">
        <ReactMarkdown>
          {answer}
        </ReactMarkdown>
      </div>
    ) : (
      "Answer will appear here..."
    )
  }

</div>

        </div>

      </div>

      {showDialog && (
  <div
    className="dialog-overlay"
    onClick={closeDialog}
  >
    <div
      className="dialog-box warning"
      onClick={(e) => e.stopPropagation()}
    >
      <h3>Notice</h3>

      <p>{dialogMessage}</p>

      <button
        className="dialog-btn"
        onClick={closeDialog}
      >
        OK
      </button>
    </div>
  </div>
)}
    </>
  );
}
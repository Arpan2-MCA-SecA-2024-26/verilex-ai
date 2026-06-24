import { saveToHistory } from "../utils/saveHistory";
import { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import LoadingDots from "../components/LoadingDots";
import axios from 'axios';
import ConfidenceMeter from "../components/ConfidenceMeter";
import API_URL from "../utils/api";

export default function FactCheck() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [realProb, setRealProb] = useState(0);
  const [fakeProb, setFakeProb] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [liveEvidence, setLiveEvidence] = useState('');
  const [legalWarning, setLegalWarning] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useXai, setUseXai] = useState(false);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('info');

  const fileInputRef = useRef(null);

  const openDialog = (msg, type = 'info') => {
    setDialogMessage(msg);
    setDialogType(type);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const handleUploadClick = () => {
    const user =
      typeof window !== 'undefined' ? localStorage.getItem('userName') : null;

    if (!user) {
      openDialog('Please login first to use file upload.', 'warning');
      return;
    }

    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const userEmail = localStorage.getItem("userEmail");
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('use_xai', useXai);
    formData.append('email', userEmail);

    try {
      setLoading(true);
      setResult('');
      setConfidence(0);
      setExplanation('');

      const res = await axios.post(
        `${API_URL}/fact-check-upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      saveToHistory(

  "Fact Check",

  res.data.extracted_text,

  res.data.result,

  res.data.confidence,

  res.data.explanation

);
      setResult(res.data.result || 'No result received');
      setConfidence(res.data.confidence || 0);
      setRealProb(res.data.real_confidence || 0);
      setFakeProb(res.data.fake_confidence || 0);
      setExplanation(res.data.explanation || '');
      setLiveEvidence(res.data.live_evidence || '');
      setLegalWarning(res.data.legal_warning || '');
      setSources(res.data.sources || []);
      setText(res.data.extracted_text || '');

      openDialog(
        `File "${selectedFile.name}" uploaded and analyzed successfully.`,
        'success'
      );
    } catch (err) {
      openDialog(
        err.response?.data?.message ||
          'File upload failed. Please upload a txt, text-based pdf, or docx file.',
        'error'
      );
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      openDialog('Please enter some text first.', 'warning');
      return;
    }

    try {
      setLoading(true);
      setResult('');
      setConfidence(0);
      setExplanation('');

      const userEmail = localStorage.getItem("userEmail");
      const res = await axios.post(
        `${API_URL}/fact-check`,
        {
          text,
          use_xai: useXai,
          email: userEmail
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      saveToHistory(
  "Fact Check",
  text,
  res.data.result,
  res.data.confidence,
  res.data.explanation
);

setResult(res.data.result || 'No result received');
setConfidence(res.data.confidence || 0);
setRealProb(res.data.real_confidence || 0);
setFakeProb(res.data.fake_confidence || 0);
setExplanation(res.data.explanation || '');
setLiveEvidence(res.data.live_evidence || '');
setLegalWarning(res.data.legal_warning || '');
setSources(res.data.sources || []);

    } catch (err) {
      openDialog(
        err.response?.data?.message || 'Something went wrong',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

const downloadReport = async () => {

  try {

    const res = await axios.post(

      `${API_URL}/generate-report`,

      {

        text,

        result,

        confidence,

        explanation

      },

      {

        responseType: "blob"

      }

    );


    const url = window.URL.createObjectURL(

      new Blob([res.data])

    );


    const link = document.createElement("a");


    link.href = url;

    link.download =
      "VeriLex_Report.pdf";


    link.click();

  }

  catch(err){

    openDialog(

      "PDF generation failed.",

      "error"

    );

  }

};

  return (
    <>
      <Navbar />

      <div className="center-page">
        <div className="card">
          <h2 className="title">📰 Fake News Detection</h2>
          <p className="sub">Analyze and verify news instantly</p>

          <textarea
            rows="8"
            placeholder={"Enter news text...\nNote: Please don't enter too small texts. Enter medium-sized text."}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileChange}
          />

          <div style={{ marginBottom: '16px', color: 'white' }}>
            <label style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={useXai}
                onChange={(e) => setUseXai(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Show Explanation (XAI)
            </label>
          </div>

          <div className="hero-btns">
            <button
              className="btn"
              onClick={handleSubmit}
              disabled={loading}
              type="button"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
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

  {result ? (

    <div className="result-content">

      <p>

        <strong>
          Prediction:
        </strong>

        {" "}

        {result}

      </p>


      {useXai && explanation && (

        <p className="explanation-text">

          <strong>
            Explanation:
          </strong>

          {" "}

          {explanation}

        </p>

      )}

      <div className="extra-analysis-section">

  {liveEvidence && (

    <div className="analysis-block">

      <h3 className="analysis-heading">
        🌐 Live Evidence
      </h3>

      <p className="analysis-text">
        {liveEvidence}
      </p>

    </div>

  )}

  {sources.length > 0 && (

    <div className="analysis-block">

      <h3 className="analysis-heading">
        📰 Sources
      </h3>

      <ul className="sources-list">

        {sources.map((src, index) => (

          <li key={index}>
            {src}
          </li>

        ))}

      </ul>

    </div>

  )}

  {legalWarning && (

    <div className="analysis-block legal-warning-box">

      <h3 className="analysis-heading">
        ⚖️ Legal Insight
      </h3>

      <p className="analysis-text">
        {legalWarning}
      </p>

    </div>

  )}

</div>

    </div>

  ) : (

    loading ? (

        <LoadingDots />

    ) : (

        'Result will appear here...'

    )

)}

</div>
        </div>
      </div>
      {result && (

  <div className="confidence-section">

   <ConfidenceMeter
   realPercent={Number(realProb) || 0}
   fakePercent={Number(fakeProb) || 0}
/>

  </div>

)}

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
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";

export default function History(){

    const router = useRouter();
    const [history,setHistory] = useState([]);
    const [selectedItem,setSelectedItem] = useState(null);
    const [showDialog,setShowDialog] = useState(false);
    const [deleteItem,setDeleteItem] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(()=>{

        const userName =
            localStorage.getItem(
                "userName"
            );

        const historyKey =
            `analysisHistory_${userName}`;

        const savedHistory =
            JSON.parse(
                localStorage.getItem(
                    historyKey
                )
            ) || [];

        setHistory(
            savedHistory.reverse()
        );

    },[]);


    const formatDate = (date)=>{

        return new Date(date)
            .toLocaleString(
                "en-GB",
                {
                    day:"numeric",
                    month:"long",
                    year:"numeric",
                    hour:"numeric",
                    minute:"2-digit",
                    hour12:true
                }
            );

    };


    const deleteHistory = ()=>{

        if(!deleteItem) return;

        const userName =
            localStorage.getItem(
                "userName"
            );

        const historyKey =
            `analysisHistory_${userName}`;

        const updated =
            history.filter(
                item =>
                    item.id !==
                    deleteItem.id
            );

        setHistory(updated);
        const newTotalPages = Math.ceil(updated.length / ITEMS_PER_PAGE);

    if(currentPage > newTotalPages){
    setCurrentPage(
        Math.max(
            newTotalPages,
            1
        )
    );
}

        localStorage.setItem(
            historyKey,
            JSON.stringify(
                [...updated].reverse()
            )
        );

        setShowDeleteDialog(
            false
        );

        setDeleteItem(
            null
        );

    };


    const viewReport = (item)=>{

        setSelectedItem(item);

        setShowDialog(true);

    };


    const downloadReport = async (item)=>{

    try{

        const res = await axios.post(

            "http://127.0.0.1:5000/generate-report",

            {

                text:
                    item?.text,

                result:
                    item?.result,

                confidence: item?.confidence || 0,

                explanation:
                    item?.explanation || "No explanation available"

            },

            {

                responseType:
                    "blob"

            }

        );

        const blob = new Blob(
    [res.data],
    { type: "application/pdf" }
);

const url =
    window.URL.createObjectURL(blob);

const a =
    document.createElement("a");

a.href = url;
a.download =
    "VeriLex_Report.pdf";

document.body.appendChild(a);

a.click();

a.remove();

window.URL.revokeObjectURL(url);

    }

catch (err) {

    console.error("PDF ERROR:", err);

    if (err.response) {

        const text =
            await err.response.data.text();

        console.log("Backend Error:", text);
    }

    alert("PDF generation failed.");
}

};

const totalItems = history.length;
const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const endIndex = startIndex + ITEMS_PER_PAGE;
const currentHistory = history.slice(startIndex, endIndex);

    return(

        <div className="history-page">

            <div className="history-card">

                <h1 className="history-title">
                    Analysis History
                </h1>

                {

                    history.length===0 ?

                    (

                        <div className="empty-history">
                            No analysis yet.
                        </div>

                    )

                    :

                    (

                        <div className="history-list">

                            {

                                currentHistory.map(
                                    (item)=>(

                                        <div
                                            key={item.id}
                                            className="history-item"
                                        >

                                            <div className="history-left">

                                                <div className="history-type">
                                                    {item.type}
                                                </div>

                                                <div className="history-date">
                                                    {formatDate(item.date)}
                                                </div>

                                                <div className="history-result">
                                                    {item.result}
                                                </div>

                                            </div>



                                            <div className="history-actions">

                                                <button
                                                    title="View report"
                                                    className="history-btn"
                                                    onClick={() =>
                                                        viewReport(item)
                                                    }
                                                >
                                                    👁️
                                                </button>


                                                <button
                                                    title="Download report"
                                                    className="history-btn"
                                                    onClick={() =>
                                                        downloadReport(item)
                                                    }
                                                >
                                                    ⬇️
                                                </button>


                                                <button
                                                    title="Delete history"
                                                    className="history-btn delete-btn"
                                                    onClick={()=>{

                                                        setDeleteItem(item);

                                                        setShowDeleteDialog(
                                                            true
                                                        );

                                                    }}
                                                >
                                                    🗑️
                                                </button>

                                            </div>

                                        </div>

                                    )
                                )

                            }

                        </div>

                    )

                }
                {
                history.length > 0 && (

        <div
            className="history-pagination"
        >

            <div
                className="pagination-info"
            >

                {
                    startIndex + 1
                }

                {" - "}

                {
                    Math.min(
                        endIndex,
                        totalItems
                    )
                }

                {" / "}

                {
                    totalItems
                }

            </div>


            <div
                className="pagination-controls"
            >

                <button
                    className="page-btn"
                    disabled={
                        currentPage === 1
                    }
                    onClick={() =>
                        setCurrentPage(1)
                    }
                >
                    ≪
                </button>


                <button
                    className="page-btn"
                    disabled={
                        currentPage === 1
                    }
                    onClick={() =>
                        setCurrentPage(
                            currentPage - 1
                        )
                    }
                >
                    ‹
                </button>


                {

                    [...Array(totalPages)]
                    .map(
                        (_, index)=>(

                            <button

                                key={index}

                                className={
                                    currentPage ===
                                    index + 1

                                    ?

                                    "page-btn active"

                                    :

                                    "page-btn"
                                }

                                onClick={()=>

                                    setCurrentPage(
                                        index + 1
                                    )

                                }
                            >

                                {
                                    index + 1
                                }

                            </button>

                        )
                    )

                }


                <button
                    className="page-btn"
                    disabled={
                        currentPage ===
                        totalPages
                    }
                    onClick={() =>
                        setCurrentPage(
                            currentPage + 1
                        )
                    }
                >
                    ›
                </button>


                <button
                    className="page-btn"
                    disabled={
                        currentPage ===
                        totalPages
                    }
                    onClick={() =>
                        setCurrentPage(
                            totalPages
                        )
                    }
                >
                    ≫
                </button>

            </div>

        </div>

    )
}
            <div
  style={{
    display: "flex",
    justifyContent: "center",
    marginTop: "60px",
    marginBottom: "20px"
  }}
>
  <button
    className="home-btn"
    onClick={() => router.push("/")}
  >
    <FaHome />
    Back to Home
  </button>
</div>
            </div>


            {/* REPORT POPUP */}

            {

                showDialog && (

                    <div
                        className="dialog-overlay"
                        onClick={() =>
                            setShowDialog(false)
                        }
                    >

                        <div
                            className="report-dialog"
                            onClick={(e)=>
                                e.stopPropagation()
                            }
                        >

                            <h2>
                                📄 Analysis Report
                            </h2>


                            <div className="report-box">

                                <p>
                                    <strong>
                                        Analysis Type:
                                    </strong>

                                    {" "}
                                    {selectedItem?.type}
                                </p>


                                <p>

                                    <strong>
                                        Checked On:
                                    </strong>

                                    {" "}

                                    {
                                        formatDate(
                                            selectedItem?.date
                                        )
                                    }

                                </p>


                                <p>

                                    <strong>
                                        Prediction:
                                    </strong>

                                    {" "}

                                    {selectedItem?.result}

                                </p>


                                <hr/>


                                <p>

                                    <strong>
                                        Original Input:
                                    </strong>

                                </p>


                                <div
                                    className="report-preview"
                                >

                                    {
                                        selectedItem?.text
                                    }

                                </div>

                            </div>


                            <button
                                className="dialog-btn"
                                onClick={()=>
                                    setShowDialog(false)
                                }
                            >

                                Close

                            </button>

                        </div>

                    </div>

                )

            }



            {/* DELETE POPUP */}

            {

                showDeleteDialog && (

                    <div
                        className="dialog-overlay"
                    >

                        <div
                            className="delete-dialog"
                        >

                            <h2>
                                ⚠ Delete Record?
                            </h2>


                            <p>

                                Are you sure you want
                                to delete this record?

                            </p>


                            <div
                                className="delete-actions"
                            >

                                <button
                                    className="dialog-btn"
                                    onClick={()=>

                                        setShowDeleteDialog(
                                            false
                                        )

                                    }
                                >

                                    Cancel

                                </button>


                                <button
                                    className="delete-confirm-btn"
                                    onClick={
                                        deleteHistory
                                    }
                                >

                                    Delete

                                </button>

                            </div>

                        </div>

                    </div>

                )

            }

        </div>

    );

}
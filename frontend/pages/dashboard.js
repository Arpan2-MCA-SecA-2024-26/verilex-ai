import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";

const badges = [

    { min: 0, icon: "🌱", name: "Beginner" },

    { min: 5, icon: "📝", name: "Learner" },

    { min: 10, icon: "🔍", name: "Researcher" },

    { min: 20, icon: "🥉", name: "Analyst" },

    { min: 35, icon: "⚖️", name: "Legal Explorer" },

    { min: 50, icon: "📰", name: "Fact Hunter" },

    { min: 75, icon: "🥈", name: "Investigator" },

    { min: 100, icon: "🧠", name: "AI Expert" },

    { min: 150, icon: "🥇", name: "Elite Verifier" },

    { min: 250, icon: "👑", name: "Master Verifier" }

];


const getAchievement = (count) => {

    let current = badges[0];

    badges.forEach(badge => {

        if(count >= badge.min){

            current = badge;

        }

    });

    return `${current.icon} ${current.name}`;

};

export default function Dashboard() {

    const router = useRouter();

    const [userName, setUserName] = useState("");
    const [stats, setStats] = useState({

    total:0,
    fact:0,
    legal:0,
    constitutional:0

});

const [history, setHistory] = useState([]);
    const [showBadgeDialog, setShowBadgeDialog] =
    useState(false);

    useEffect(()=>{

    const name =
        localStorage.getItem(
            "userName"
        );

    setUserName(name || "");


    const statsKey =
        `analysisStats_${name}`;


    const stats =
        JSON.parse(
            localStorage.getItem(
                statsKey
            )
        ) || {

            total:0,
            fact:0,
            legal:0,
            constitutional:0

        };


    setStats(stats);
    const historyKey =

    `analysisHistory_${name}`;


const savedHistory =

    JSON.parse(

        localStorage.getItem(

            historyKey

        )

    ) || [];


setHistory(

    savedHistory

);

},[]);


    const recentActivities =
        history.slice(0, 5);
        const achievement =
    getAchievement(
        stats.total
    );
    const last7Days = [];

for(let i = 6; i >= 0; i--){

    const date = new Date();

    date.setDate(
        date.getDate() - i
    );

    const dateKey =
        date.toDateString();


    const count =
        history.filter(item => {

            const itemDate =
                new Date(
                    item.date
                ).toDateString();

            return itemDate === dateKey;

        }).length;


    last7Days.push({

        label:
            date.toLocaleDateString(
                "en-GB",
                {
                    day:"2-digit",
                    month:"short",
                    year:"numeric"
                }
            ),

        count

    });

}


    const fakePercent =

    stats.total > 0

        ?

        Math.round(

            (stats.fact / stats.total)

            * 100

        )

        : 0;



const legalPercent =

    stats.total > 0

        ?

        Math.round(

            (stats.legal / stats.total)

            * 100

        )

        : 0;

const constitutionalPercent =

stats.total > 0

    ?

    Math.round(
        (stats.constitutional / stats.total)
        * 100
    )

    : 0;

    return (

        <div className="dashboard-page">

            <div className="dashboard-card">

                <h1 className="dashboard-title">
                    Welcome, {userName}
                </h1>

                {/* STATS */}

                <div className="stats-grid">

                    <div className="stat-box">
                        <div className="stat-label">
                            Total Checks
                        </div>

                        <div className="stat-value">
                            {stats.total}
                        </div>
                    </div>


                    <div className="stat-box">
                        <div className="stat-label">
                            Fact Checks
                        </div>

                        <div className="stat-value">
                            {stats.fact}
                        </div>
                    </div>


                    <div className="stat-box">
                        <div className="stat-label">
                            Legal Checks
                        </div>

                        <div className="stat-value">
                            {stats.legal}
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-label">
                            Constitutional Q&A
                        </div>

                        <div className="stat-value">
                            {stats.constitutional}
                    </div>

                    </div>

                </div>


                {/* QUICK ACTIONS */}

                <div className="quick-actions">

                    <button
                        className="btn"
                        onClick={() => router.push("/fact-check")}
                    >
                        New Fact Check
                    </button>


                    <button
                        className="btn"
                        onClick={() => router.push("/legal")}
                    >
                        Legal Assistant
                    </button>


                    <button
                        className="btn"
                        onClick={() => router.push("/history")}
                    >
                        View History
                    </button>


                    <button
                        className="btn"
                        onClick={() => router.push("/constitutional-qa")}
                    >
                        Constitutional Q&A
                    </button>

                </div>


                {/* ACCURACY */}

                <div className="analytics-box">

                    <h2>Usage Analytics</h2>

                    <p>
                        Fact Checks: {fakePercent}%
                    </p>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${fakePercent}%`
                            }}
                        />
                    </div>


                    <p>
                        Legal Checks: {legalPercent}%
                    </p>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${legalPercent}%`
                            }}
                        />
                    </div>

                    <p>
                        Constitutional Q&A: {constitutionalPercent}%
                    </p>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${constitutionalPercent}%`
                            }}
                        />
                    </div>

                </div>


            {/* ACHIEVEMENT */}

<div className="achievement-box">

    <h2>
        Your Achievement
    </h2>

   <button
    className="achievement-badge"
    onClick={() =>
        setShowBadgeDialog(true)
    }
>

    {achievement}

</button>
{

    showBadgeDialog && (

        <div
            className="dialog-overlay"
            onClick={() =>
                setShowBadgeDialog(false)
            }
        >

            <div
                className="badge-dialog"
                onClick={(e)=>
                    e.stopPropagation()
                }
            >

                <h2>
                    Achievement Levels
                </h2>


                {

                    badges.map(
                        (badge,index)=>(

                            <div
                                key={index}
                                className="badge-row"
                            >

                                <span>

                                    {badge.icon}
                                    {" "}
                                    {badge.name}

                                </span>


                                <span>

                                    {badge.min}
                                    +
                                    {" "}
                                    checks

                                </span>

                            </div>

                        )
                    )

                }


                <button
                    className="dialog-btn"
                    onClick={() =>
                        setShowBadgeDialog(false)
                    }
                >

                    Close

                </button>

            </div>

        </div>

    )

}

</div>



{/* WEEKLY ACTIVITY */}

<div className="weekly-box">

    <h2>
        Weekly Activity
    </h2>


    {

        last7Days.map(
            (day,index)=>(

                <div
                    key={index}
                    className="weekly-row"
                >

                    <span>
                        {day.label}
                    </span>


                    <div className="mini-chart">

                        <div
                            className="mini-bar"
                            style={{
                                width:
                                    `${day.count * 25}px`
                            }}
                        />

                    </div>


                    <span>
                        {day.count}
                    </span>

                </div>

            )
        )

    }

</div>

                {/* RECENT ACTIVITY */}

                <div className="recent-box">

                    <h2>
                        Recent Activity
                    </h2>

                    {
                        recentActivities.map(
                            (item, index) => (

                                <div
                                    key={index}
                                    className="recent-item"
                                >
                                    {item.type}
                                    {" — "}
                                    {item.result}
                                </div>

                            )
                        )
                    }

                </div>
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

        </div>


    );

}
export const saveToHistory = (

    type,
    input,
    result,
    confidence = 0,
    explanation = ""

) => {

    const userName =
        localStorage.getItem("userName");

    if (!userName) return;


    const historyKey =
        `analysisHistory_${userName}`;


    const statsKey =
        `analysisStats_${userName}`;


    const oldHistory =
        JSON.parse(
            localStorage.getItem(historyKey)
        ) || [];


    const oldStats =
        JSON.parse(
            localStorage.getItem(statsKey)
        ) || {

            total:0,
            fact:0,
            legal:0,
            constitutional:0
        };


    const newEntry = {

        id: crypto.randomUUID(),

        type,

        text: input,

        result,

        confidence,

        explanation,

        date:
            new Date().toISOString()

    };


    oldHistory.unshift(
        newEntry
    );


    oldStats.total++;


    if(type==="Fact Check"){

        oldStats.fact++;

    }


    if(type==="Legal Assistant"){

        oldStats.legal++;

    }

    if(type==="Constitutional Q&A"){

        oldStats.constitutional++;
    }


    localStorage.setItem(

        historyKey,

        JSON.stringify(oldHistory)

    );


    localStorage.setItem(

        statsKey,

        JSON.stringify(oldStats)

    );

};
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from "recharts";

export default function ConfidenceMeter({

    fakePercent = 0,
    realPercent = 0

}) {

    const safeFake = Number(fakePercent) || 0;
    const safeReal = Number(realPercent) || 0;

    const data = [

        {
            name: "Real",
            value: safeReal,
            color: "#4da3ff"
        },

        {
            name: "Fake",
            value: safeFake,
            color: "#ff4d6d"
        }

    ];

    return (

        <div className="confidence-container">

            <h2>
                AI Confidence
            </h2>

            <div
                className="confidence-chart"
                style={{
                    width: "220px",
                    height: "220px",
                    margin: "0 auto"
                }}
            >

                <ResponsiveContainer width="100%" height="100%">

                    <PieChart>

                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={3}
                            dataKey="value"
                            isAnimationActive={true}
                        >

                            {data.map((entry, index) => (

                                <Cell
                                    key={index}
                                    fill={entry.color}
                                />

                            ))}

                        </Pie>

                        <Tooltip />

                    </PieChart>

                </ResponsiveContainer>

            </div>

            <div className="confidence-values">

                <p>
                    ✅ Real: {safeReal}%
                </p>

                <p>
                    ❌ Fake: {safeFake}%
                </p>

            </div>

            <div className="confidence-bar">

                <div
                    className="fake-bar"
                    style={{
                        width: `${safeFake}%`
                    }}
                />

            </div>

        </div>

    );

}
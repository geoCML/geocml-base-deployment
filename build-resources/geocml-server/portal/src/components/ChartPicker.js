import { useState } from "react";
import { BarChart } from "./BarChart";
import { RawCounts } from "./RawCounts";
import { PieChart } from "./PieChart";


const chartTypes = Object.freeze({
    RAW_COUNTS: 1,
    BAR: 2,
    PIE: 3
})

export function ChartPicker(props) {
    const [selectedChartType, setSelectedChartType] = useState(undefined);
    const [showMenu, setShowMenu] = useState(false);


    function closeChart() {
        setShowMenu(false);
        setSelectedChartType(undefined);
        localStorage.removeItem(`chart-picker-${props.n}`)
    }

    function getAxesFromChart(axes) {
        axes = axes.map((axis) => {
            return { 
                layer: axis.layer.name,
                field: axis.field
            }
        });

        const value = JSON.stringify({
            selectedChartType,
            axes
        });

        if (!localStorage.getItem(`chart-picker-${props.n}`) || localStorage.getItem(`chart-picker-${props.n}`) !== value)
            localStorage.setItem(`chart-picker-${props.n}`, value);
    }

    function getChartByType() {
        const axes = localStorage.getItem(`chart-picker-${props.n}`) ? JSON.parse(localStorage.getItem(`chart-picker-${props.n}`)).axes : [];

        if (selectedChartType === chartTypes.RAW_COUNTS)
            return ( <RawCounts axis={axes} onClose={closeChart} onSetAxis={getAxesFromChart} /> );

        else if (selectedChartType === chartTypes.BAR)
            return ( <BarChart axes={axes} onClose={closeChart} onSetAxis={getAxesFromChart} /> );

        else if (selectedChartType === chartTypes.PIE)
            return ( <PieChart axis={axes} onClose={closeChart} onSetAxis={getAxesFromChart} /> );

        return ( <RawCounts axis={axes} onClose={closeChart} onSetAxis={getAxesFromChart} /> );
    }


    if (!selectedChartType && localStorage.getItem(`chart-picker-${props.n}`))
        setSelectedChartType(JSON.parse(localStorage.getItem(`chart-picker-${props.n}`)).selectedChartType);
    else if (!selectedChartType)
        return (
            <div id={`chart-picker-${props.n}`} className="border text-center justify-content-center rounded-3" style={{ height: "400px", paddingTop: "20%" }}>
                <button className="border text-center btn" type="button" onClick={() => setShowMenu(!showMenu)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10%" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                </button>

                { showMenu ?
                    (
                     <div style={{ marginRight: "30%", marginLeft: "30%" }}>
                        <button className="btn btn-light border" type="button" onClick={() => setSelectedChartType(chartTypes.RAW_COUNTS)}>Raw Counts</button>
                        <button className="btn btn-light border" type="button" onClick={() => setSelectedChartType(chartTypes.BAR)}>Bar Chart</button>
                        <button className="btn btn-light border" type="button" onClick={() => setSelectedChartType(chartTypes.PIE)}>Pie Chart</button>
                      </div>
                    ) : <h5 className="pt-4">Click the
                            <span className="px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16px" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                </svg>
                            </span>
                        button to add a chart to the dashboard.</h5>
                }
            </div>
        )
    else
        return getChartByType();
}

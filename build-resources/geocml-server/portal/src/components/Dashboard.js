import { useSelector } from "react-redux";
import { ChartPicker } from "./ChartPicker";
import { Chart, ArcElement, Tooltip, BarElement, LinearScale, CategoryScale } from "chart.js";


Chart.register(ArcElement);
Chart.register(Tooltip);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
Chart.defaults.backgroundColor = "#004aad";


export function Dashboard() {
    const isMobile = useSelector((state) => state.app.isMobile);

    if (!isMobile)
        return (
            <div className="px-2 py-2">
                <h3 className="row justify-content-center py-1">WFS Dashboard</h3>
                <i className="row justify-content-center py-2">Quantitative analysis for hosted WFS layers</i>
                <div className="row pb-3">
                    <div className="col">
                        <ChartPicker n={0} />
                    </div>
                    <div className="col">
                        <ChartPicker n={1} />
                    </div>
                </div>

                <div className="row pb-3">
                    <div className="col">
                        <ChartPicker n={2} />
                    </div>
                    <div className="col">
                        <ChartPicker n={3} />
                    </div>
                </div>

                <div className="row pb-3">
                    <div className="col">
                        <ChartPicker n={4} />
                    </div>
                    <div className="col">
                        <ChartPicker n={5} />
                    </div>
                </div>
            </div>
        )
    else
        return (<div></div>)
}


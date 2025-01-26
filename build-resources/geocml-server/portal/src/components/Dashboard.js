import { RawCounts } from "./RawCounts";
import { BarChart } from "./BarChart";
import { PieChart } from "./PieChart";
import { Chart, ArcElement, Tooltip, BarElement, LinearScale, CategoryScale } from "chart.js";


Chart.register(ArcElement);
Chart.register(Tooltip);
Chart.register(CategoryScale);
Chart.register(LinearScale);
Chart.register(BarElement);
Chart.defaults.backgroundColor = "#004aad";


export function Dashboard() {
    return (
        <div className="px-2 py-5">
            <h3 className="row justify-content-center pt-2">WFS Dashboard</h3>
            <RawCounts />
            <BarChart />
            <PieChart />
        </div>
    )
}


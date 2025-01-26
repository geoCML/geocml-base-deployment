import { RawCounts } from "./RawCounts";
import { BarChart } from "./BarChart";
import { PieChart } from "./PieChart";

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


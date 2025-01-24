import { useSelector } from "react-redux";
import { useState } from "react";
import { LayerPicker } from "./LayerPicker";

export function RawCounts() {
  const wmsInfoValid = useSelector((state) => state.app.wmsInfoValid);
  const [rawCount, setRawCount] = useState(0);

  function calculateRawCounts(layer, field) {
    let count = 0

    layer.features.map((feature) => {
        if (typeof feature.properties[field] === "number")
            count += feature.properties[field];
    });

    setRawCount(count);
  }


  if (wmsInfoValid) {
    try {
        return (
            <div className="border col justify-content-center">
                <div className="row text-center py-2">
                    <h5>Raw Counts</h5>
                </div>
                <div className="row text-center">
                    <LayerPicker callback={calculateRawCounts} />
                </div>
                <div className="row text-center">
                    <h1 className="display-1">{ rawCount.toLocaleString() }</h1>
                </div>
            </div>
        )
    } catch (err) {
        console.log(err);
    }
  }
}

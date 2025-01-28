import { useSelector } from "react-redux";
import { useState } from "react";
import { LayerPicker } from "./LayerPicker";

export function RawCounts(props) {
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
            <div className="border justify-content-center" style={{ height: "400px" }}>
                <div className="row justify-content-end">
                    <div
                      className="btn btn-danger border mr-5"
                      style={{
                        width: "35px",
                        marginRight: "12px"
                      }}
                      onClick={() => {props.onClose()}}
                    >
                        X
                    </div>
                </div>

                <div className="row text-center py-2">
                    <h5>Raw Counts</h5>
                </div>
                <div className="row text-center" style={{ height: "15%" }}>
                    <LayerPicker callback={calculateRawCounts} />
                </div>
                <div className="row text-center" style={{ height: "70%" }}>
                    <h1 className="display-1 pt-5">{ rawCount.toLocaleString() }</h1>
                </div>
            </div>
        )
    } catch (err) {
        console.log(err);
    }
  }
}

import { useSelector } from "react-redux";
import { useState } from "react";
import { LayerPicker } from "./LayerPicker";
import { Bar } from "react-chartjs-2";


export function BarChart(props) {
  const wmsInfoValid = useSelector((state) => state.app.wmsInfoValid);
  const [xAxis, setXAxis] = useState(undefined);
  const [yAxis, setYAxis] = useState(undefined);
  const [xLabels, setXLabels] = useState(undefined);


  function findUniqueFieldValues(axis) {
    const knownFieldValues = [];

    if (!axis)
      return knownFieldValues;

    axis.layer.features.map((feature) => {
        knownFieldValues.push(feature.properties[axis.field]);
    });

    setXLabels([...new Set(knownFieldValues)]);
  }


  function aggregateCountsOfUniqueFieldValues() {
      if (!yAxis || !xAxis || !xLabels)
        return [];

      const values = {};

      xLabels.forEach((val) => {
          values[val] = 0;
      });

      yAxis.layer.features.map((feature) => {
          if (typeof feature.properties[yAxis.field] !== "number") // TODO: rm me!
              return

          if (xLabels.includes(feature.properties[xAxis.field]))
              values[feature.properties[xAxis.field]]++;
      });

      return Object.keys(values).map((val) => values[val]);
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
                    <h5>Bar Chart</h5>
                </div>

                <div className="row text-center" style={{ height: "15%" }}>
                    <div className="col">
                        <LayerPicker callback={(layer, field) => setXAxis(() => {
                            const axis = { layer, field };
                            findUniqueFieldValues(axis);
                            return axis;
                        })} label="x-axis: "/>
                    </div>
                    <div className="col">
                        <LayerPicker callback={(layer, field) => setYAxis({ layer, field })} label="y-axis: "/>
                    </div>
                </div>

                <div className="row justify-content-center" style={{ height: "60%" }}>
                    <Bar
                      data={{
                        labels: xLabels ? xLabels : [],
                        datasets: [{
                            label: "Counts",
                            data: aggregateCountsOfUniqueFieldValues(),
                            borderWidth: 1,
                        }],
                      }}
                      updateMode={"resize"}
                    />
                </div>
            </div>
        )
    } catch (err) {
        console.log(err);
    }
  }
}

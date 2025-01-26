import { useSelector } from "react-redux";
import { useState } from "react";
import { LayerPicker } from "./LayerPicker";
import { Pie } from "react-chartjs-2";


export function PieChart() {
  const wmsInfoValid = useSelector((state) => state.app.wmsInfoValid);
  const [axis, setAxis] = useState(undefined);
  const [labels, setLabels] = useState(undefined);

  function getRandomColors() {
      const colors = [];

      if (!labels)
        return colors;

      labels.forEach(() => {
        colors.push(`rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`)
      })

      return colors
  }

  function findUniqueFieldValues(axis) {
    const knownFieldValues = [];

    if (!axis)
      return knownFieldValues;

    axis.layer.features.map((feature) => {
        knownFieldValues.push(feature.properties[axis.field]);
    });

    setLabels([...new Set(knownFieldValues)]);
  }


  function aggregateCountsOfUniqueFieldValues() {
      if (!axis || !labels)
        return [];

      const values = {};

      labels.forEach((val) => {
          values[val] = 0;
      });

      axis.layer.features.map((feature) => {
          if (labels.includes(feature.properties[axis.field]))
              values[feature.properties[axis.field]]++;
      });

      return Object.keys(values).map((val) => values[val]);
  }


  if (wmsInfoValid) {
    try {
        return (
            <div className="border col justify-content-center">
                <div className="row text-center py-2">
                    <h5>Pie Chart</h5>
                </div>
                <div className="row text-center">
                    <LayerPicker callback={(layer, field) => setAxis(() => {
                        const tmpAxis = { layer, field };
                        findUniqueFieldValues(tmpAxis);
                        return tmpAxis;
                    })}/>
                </div>
                <div className="row text-center">
                <Pie
                  data={{
                    labels: labels ? labels : [],
                    datasets: [{
                        data: aggregateCountsOfUniqueFieldValues(),
                        backgroundColor: getRandomColors(),
                        borderWidth: 1,
                    }],
                  }}
                  width={"960px"}
                />
                </div>
            </div>
        )
    } catch (err) {
        console.log(err);
    }
  }
}

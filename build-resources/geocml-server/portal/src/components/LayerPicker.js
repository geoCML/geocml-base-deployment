import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export function LayerPicker(props) {
  const wfsLayers = useSelector((state) => state.app.wfsLayers);
  const wmsInfoValid = useSelector((state) => state.app.wmsInfoValid);
  const [selectedLayer, setSelectedLayer] = useState(undefined);
  const [selectedField, setSelectedField] = useState(undefined);

  useEffect(() => {
      if (!selectedLayer && wfsLayers && wfsLayers.length > 0) {
          if (props.axis) {
              const foundLayer = wfsLayers.filter((layer) => layer.name === props.axis.layer)[0];
              setSelectedLayer(foundLayer);
              setSelectedField(props.axis.field);
          } else {
              setSelectedLayer(wfsLayers[0]);
              setSelectedField(Object.keys(wfsLayers[0].features[0].properties)[0]);
          }
      }

      if (selectedLayer && selectedField) {
        props.callback(selectedLayer, selectedField);
      }
  }, [selectedLayer, selectedField, wfsLayers])

  if (wmsInfoValid) {
    try {
        return (
          <div 
            className="px-2 py-1 row"
            style={{
                maxWidth: "100%"
            }}>
            {
                props.label ? (<p className="col-md-3">{props.label}</p>) 
                : <div className="col-md-3"></div>
            }
            <select onChange={(e) => {
                setSelectedField(Object.keys(selectedLayer.features[0].properties)[0]);
                const foundLayer = wfsLayers.filter((layer) => layer.name === e.target.value)[0];
                setSelectedLayer(foundLayer);
            }}
                className="mx-2 col-md-3"
                style={{
                    maxWidth: "25%"
                }}
            >
            {
                wfsLayers.length ? wfsLayers.map((layer) => {
                    if (selectedLayer && selectedLayer === layer.name) {
                        return (
                            <option value={layer.name} selected={true}>{layer.name}</option>
                        )
                    } else {
                        return (
                            <option value={layer.name}>{layer.name}</option>
                        )
                    }
                }) : (<div></div>)
            }
            </select>

            <select onChange={(e) => {
                setSelectedField(e.target.value);
            }}
                className="mx-2 col-md-3"
                style={{
                    maxWidth: "25%"
                }}
            >
            {
                selectedLayer ? Object.keys(selectedLayer.features[0].properties).map((field) => {
                    if (selectedField && selectedField === field) {
                        return (
                            <option value={field} selected={true}>{field}</option>
                        )
                    } else {
                        return (
                            <option value={field}>{field}</option>
                        )
                    }
                }) : (<div></div>)
            }
            </select>
        </div>
      )
    } catch (err) {
        console.log(err);
    }
  }
}

import { useSelector } from "react-redux";
import { useState } from "react";

export function LayerPicker(props) {
  const wfsLayers = useSelector((state) => state.app.wfsLayers);
  const wmsInfoValid = useSelector((state) => state.app.wmsInfoValid);
  const [selectedLayer, setSelectedLayer] = useState(undefined);
  const [selectedField, setSelectedField] = useState(undefined);
  const [needsUpdate, setNeedsUpdate] = useState(true);



  if (wmsInfoValid) {
    if (wfsLayers.length > 0 && !selectedLayer) {
      setSelectedLayer(wfsLayers[0]);
      setSelectedField(Object.keys(wfsLayers[0].features[0].properties)[0]);
    }

    if (selectedLayer && selectedField && needsUpdate) {
      props.callback(selectedLayer, selectedField);
      setNeedsUpdate(false);
    }

    try {
        return (
          <div 
            className="px-2 py-1 row"
            style={{
                maxWidth: "50%"
            }}>
            {
                props.label ? (<p className="col-md-3">{props.label}</p>) 
                : <div className="col-md-3"></div>
            }
            <select onChange={(e) => {
                setSelectedField(Object.keys(selectedLayer.features[0].properties)[0]);
                const foundLayer = wfsLayers.filter((layer) => layer.name === e.target.value)[0];
                setSelectedLayer(foundLayer);
                setNeedsUpdate(true);
            }}
                className="mx-2 col-md-3"
                style={{
                    maxWidth: "25%"
                }}
            >
            {
                wfsLayers.length ? wfsLayers.map((layer) => {
                    return (
                        <option value={layer.name}>{layer.name}</option>
                    )
                }) : (<div></div>)
            }
            </select>

            <select onChange={(e) => {
                setSelectedField(e.target.value);
                setNeedsUpdate(true);
            }}
                className="mx-2 col-md-3"
                style={{
                    maxWidth: "25%"
                }}
            >
            {
                selectedLayer ? Object.keys(selectedLayer.features[0].properties).map((field) => {
                    return (
                        <option value={field}>{field}</option>
                    )
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

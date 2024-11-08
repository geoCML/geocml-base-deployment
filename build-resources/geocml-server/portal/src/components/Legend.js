import { useSelector } from "react-redux";

export function Legend() {
  const layers = useSelector((state) => state.app.layers);

  return (
    <div
      id="legend"
      className="position-absolute bg-light rounded p-2 overflow-auto"
      style={{
        bottom: "25px",
		right: 0,
        zIndex: 99,
        maxHeight: "40%",
        maxWidth: "20%",
      }}
    >
	  <img src={`/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERTITLE=true&RULELABEL=true&LAYERS=${layers.map((layer) => {
		  return layer.name
	  }).reverse().join(",")}`} alt="Legend"/>
    </div>
  );
}

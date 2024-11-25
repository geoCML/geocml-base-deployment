import { useSelector } from "react-redux";

export function Legend() {
  const layers = useSelector((state) => state.app.layers);

  return (
    <div
      id="legend"
      className="position-absolute bg-light rounded p-2 overflow-auto"
      style={{
        bottom: 70,
        right: 0,
        zIndex: 99,
        maxHeight: "40%",
        maxWidth: "30%",
      }}
    >
      <img className="w-100" src={`/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERTITLE=true&RULELABEL=true&LAYERS=${layers.map((layer) => {
          return layer.name
      }).reverse().join(",")}`} alt="Legend"/>
    </div>
  );
}

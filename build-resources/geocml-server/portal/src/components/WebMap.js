import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LayersPane } from "./LayersPane";
import { hideWebMap } from "../app-slice";

const L = require("leaflet");

export function WebMap() {
  const dispatch = useDispatch();
  const map = useRef(undefined);
  const layers = useSelector((state) => state.app.layers);
  const webMapVisible = useSelector((state) => state.app.webMapVisible);

  useEffect(() => {
    if (webMapVisible) {
      if (!map.current) {
        map.current = L.map("map");
        map.current.setView([0, 0], 1);
      }

      map.current.eachLayer((layer) => {
        map.current.removeLayer(layer);
      });

      const wmsTileLayer = L.tileLayer.wms("/cgi-bin/qgis_mapserv.fcgi", {
        layers: layers
          .filter((layer) => layer.visible)
          .reverse()
          .map((layer) => layer.name)
          .join(","),
        format: "image/webp",
        transparent: true,
        detectRetina: true,
      });

      wmsTileLayer.addTo(map.current);
    }
  }, [webMapVisible, layers]);

  if (webMapVisible === true) {
    return (
      <div>
        <div
          id="map"
          className="position-absolute m-auto w-100 h-100"
          style={{
            top: 0,
            left: 0,
            zIndex: 98,
          }}
        ></div>

        <div
          className="position-absolute btn btn-light border"
          id="close-btn"
          style={{
            top: 10,
            right: 10,
            zIndex: 99,
          }}
          onClick={() => {
            dispatch(hideWebMap());
            map.current = undefined;
          }}
        >
          Close
        </div>

        <LayersPane />
      </div>
    );
  }
}

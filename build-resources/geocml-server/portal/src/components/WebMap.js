import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LayersPane } from "./LayersPane";
import { Legend } from "./Legend";
import { hideWebMap, toggleLayersPane, toggleLegend } from "../app-slice";

const L = require("leaflet");

export function WebMap() {
  const dispatch = useDispatch();
  const map = useRef(undefined);
  const layers = useSelector((state) => state.app.layers);
  const webMapVisible = useSelector((state) => state.app.webMapVisible);
  const layersPaneVisible = useSelector((state) => state.app.layersPaneVisible)
  const legendVisible = useSelector((state) => state.app.legendVisible)


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

        <div
            id="toggle-layers-btn"
            className="position-absolute rounded-circle btn btn-light"
            style={{
                bottom: 25,
                left: 10,
                zIndex: 99,
            }}
        onClick= {() => {
            dispatch(toggleLayersPane())
        }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-layers" viewBox="0 0 16 16">
                <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0zM8 9.433 1.562 6 8 2.567 14.438 6z"/>
            </svg>
        </div>

        <div
            id="toggle-legend-btn"
            className="position-absolute rounded-circle btn btn-light"
            style={{
                bottom: 25,
                right: 10,
                zIndex: 99,
            }}
        onClick= {() => {
            dispatch(toggleLegend())
        }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
            </svg>
        </div>

        { layersPaneVisible ? (
            <LayersPane />
        ) : (
            <div></div>
        ) }

        { legendVisible ? (
            <Legend />
        ) : (
            <div></div>
        ) }
    </div>
    );
  }
}

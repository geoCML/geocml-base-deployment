import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import {
  loaded,
  loading,
  setWCSLayers,
  setWCSInfo,
} from "../app-slice";

function WCSLayer(name) {
  return {
    name: name,
    visible: true,
  };
}

export function collectInfoFromWCS(dispatch) {
  const xmlParser = new XMLParser();
  dispatch(loading());

  axios
    .get(
      "/cgi-bin/qgis_mapserv.fcgi?SERVICE=WCS&VERSION=1.3.0&REQUEST=GetCapabilities",
    )
    .then((res) => {
      dispatch(setWCSInfo(xmlParser.parse(res.data)));
      dispatch(setWCSLayers(getLayersFromWCSInfo(xmlParser.parse(res.data))));
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch(loaded());
    });
}

export function getLayersFromWCSInfo(wcsInfo) {
  const layers = [];
  const layersFromWCS = wcsInfo.WCS_Capabilities.ContentMetadata;
  for (const [key, val] of Object.entries(layersFromWCS)) {
    if (key === "CoverageOfferingBrief")
      if (val.length) {
        val.map((layer) => {
          layers.push(WCSLayer(layer.name));
        })
      } else {
        layers.push(WCSLayer(val.name));
      }
  }
  return layers;
}

import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import {
  loaded,
  loading,
  setWFSLayers,
  setWFSInfo,
} from "../app-slice";

function WFSLayer(name) {
  return {
    name: name,
    visible: true,
  };
}

export function collectInfoFromWFS(dispatch) {
  const xmlParser = new XMLParser();
  dispatch(loading());

  axios
    .get(
      "/cgi-bin/qgis_mapserv.fcgi?SERVICE=WFS&VERSION=1.3.0&REQUEST=GetCapabilities",
    )
    .then((res) => {
      dispatch(setWFSInfo(xmlParser.parse(res.data)));
      dispatch(setWFSLayers(getLayersFromWFSInfo(xmlParser.parse(res.data))));
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch(loaded());
    });
}

export function getLayersFromWFSInfo(wfsInfo) {
  const layers = [];
  const layersFromWFS = wfsInfo.WFS_Capabilities.FeatureTypeList;
  for (const [key, val] of Object.entries(layersFromWFS)) {
    if (key === "FeatureType")
      if (val.length) {
        val.map((layer) => {
          layers.push(WFSLayer(layer.Name));
        })
      } else {
        layers.push(WFSLayer(val.Name));
      }
  }
  return layers;
}

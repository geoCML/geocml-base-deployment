import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import {
  setWCSLayers,
  setWCSInfo,
  reportValidWCS,
  reportInvalidWCS
} from "../app-slice";

function WCSLayer(name) {
  return {
    name: name,
    visible: true,
  };
}

export async function collectInfoFromWCS(dispatch) {
  dispatch(reportInvalidWCS());
  const xmlParser = new XMLParser();

  await axios
    .get(
      "/cgi-bin/qgis_mapserv.fcgi?SERVICE=WCS&VERSION=1.3.0&REQUEST=GetCapabilities",
    )
    .then((res) => {
      dispatch(setWCSInfo(xmlParser.parse(res.data)));
      dispatch(setWCSLayers(getLayersFromWCSInfo(xmlParser.parse(res.data))));
      dispatch(reportValidWCS());
    })
    .catch((err) => {
      console.log(err);
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

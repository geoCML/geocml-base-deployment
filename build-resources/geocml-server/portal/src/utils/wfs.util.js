import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import {
  loaded,
  loading,
  setWFSLayers,
  setWFSInfo,
} from "../app-slice";

export async function WFSLayer(name) {
  const features = await getFeaturesFromLayer(name)
  return {
    name: name,
    visible: true,
    features
  }
}

async function getFeaturesFromLayer(layerName) {
    return await axios
        .get(`/cgi-bin/qgis_mapserv.fcgi?SERVICE=WFS&VERSION=1.3.0&REQUEST=GetFeature&TYPENAME=${layerName}&OUTPUTFORMAT=geojson`)
        .then((res) => {
            const features = [];

            res.data.features.forEach((feature) => {
                features.push({
                    id: feature.id,
                    properties: feature.properties
                })
            })

            return features;
        })
        .catch((err) => {
            console.error("ERROR: ", err.message);
        })
}

export function collectInfoFromWFS(dispatch) {
  const xmlParser = new XMLParser();
  dispatch(loading());

  axios
    .get(
      "/cgi-bin/qgis_mapserv.fcgi?SERVICE=WFS&VERSION=1.3.0&REQUEST=GetCapabilities",
    )
    .then(async (res) => {
      dispatch(setWFSInfo(xmlParser.parse(res.data)));
      dispatch(setWFSLayers(await getLayersFromWFSInfo(xmlParser.parse(res.data))));
    })
    .catch((err) => {
      console.error("ERROR: ", err.message);
    })
    .finally(() => {
      dispatch(loaded());
    });
}

export async function getLayersFromWFSInfo(wfsInfo) { 
  if (localStorage.getItem("wfsLayers"))
    return JSON.parse(localStorage.getItem("wfsLayers"));

  let layers = [];
  const layersFromWFS = wfsInfo.WFS_Capabilities.FeatureTypeList;

  for (const [key, val] of Object.entries(layersFromWFS)) {
    if (key === "FeatureType")
      if (val.length) {
          layers = await Promise.all(val.map(async (layer) => await WFSLayer(layer.Name)))
      } else {
        const wfsLayer = await WFSLayer(val.Name);
        layers.push(wfsLayer);
      }
  }

  return layers;
}

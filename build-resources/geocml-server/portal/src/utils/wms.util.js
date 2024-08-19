import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import {
  loaded,
  loading,
  reportInvalidWMS,
  reportValidWMS,
  setLayers,
  setWMSInfo,
} from "../app-slice";

function Layer(name) {
  return {
    name: name,
    visible: true,
  };
}

export function collectInfoFromWMS(dispatch) {
  const xmlParser = new XMLParser();
  dispatch(loading());
  dispatch(reportInvalidWMS());

  axios
    .get(
      "/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities",
    )
    .then((res) => {
      dispatch(setWMSInfo(xmlParser.parse(res.data)));
      dispatch(setLayers(getLayersFromWMSInfo(xmlParser.parse(res.data))));
      dispatch(reportValidWMS());
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch(loaded());
    });
}

export function getLayersFromWMSInfo(wmsInfo) {
  const layers = [];
  const layersFromWMS = wmsInfo.WMS_Capabilities.Capability.Layer;
  if (layersFromWMS.Layer.length) {
    layersFromWMS.Layer.map((layer) => {
      layers.push(Layer(layer.Name));
    });
  } else {
    layers.push(Layer(layersFromWMS.Layer.Name));
  }
  return layers;
}

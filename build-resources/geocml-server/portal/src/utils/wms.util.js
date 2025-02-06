import { XMLParser } from "fast-xml-parser";
import axios from "axios";
import {
  reportInvalidWMS,
  reportValidWMS,
  setWMSInfo,
} from "../app-slice";

export async function collectInfoFromWMS(dispatch) {
  const xmlParser = new XMLParser();
  dispatch(reportInvalidWMS());

  await axios
    .get(
      "/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities",
    )
    .then((res) => {
      dispatch(setWMSInfo(xmlParser.parse(res.data)));
      dispatch(reportValidWMS());
    })
    .catch((err) => {
      console.log(err);
    });
}

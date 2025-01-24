import { ContactInfo } from "./components/ContactInfo";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { collectInfoFromWMS } from "./utils/wms.util";
import { collectInfoFromWFS } from "./utils/wfs.util";
import { collectInfoFromWCS } from "./utils/wcs.util";
import { HostedLayers } from "./components/HostedLayers";
import { reportInvalidWMS, showWebMap } from "./app-slice";
import { Recommendations } from "./components/Recommendations";
import { setIsMobile } from "./app-slice";
import { LayerPicker } from "./components/LayerPicker";

export default function App() {
  const dispatch = useDispatch();
  const wmsInfo = useSelector((state) => state.app.wmsInfo);
  const wmsInfoValid = useSelector((state) => state.app.wmsInfoValid);
  const wfsLayers = useSelector((state) => state.app.wfsLayers);
  const wcsLayers = useSelector((state) => state.app.wcsLayers);
  const isMobile = useSelector((state) => state.app.isMobile);

  useEffect(() => {
    collectInfoFromWMS(dispatch);
    collectInfoFromWFS(dispatch);
    collectInfoFromWCS(dispatch);
    if (window.innerWidth <= 768) dispatch(setIsMobile())
  }, []);

  if (wmsInfoValid) {
    try {
      return (
        <div>
          <div id="general-info" className="row">
            <div className="col border p-4">
              <h1 id="title">{wmsInfo.WMS_Capabilities.Service.Title}</h1>
              <p id="copyright">
                {wmsInfo.WMS_Capabilities.Service.AccessConstraints},{" "}
                {wmsInfo.WMS_Capabilities.Service.Fees}
              </p>

              <ContactInfo />
              <LayerPicker />

              <div className="py-4"></div>
              <div className="row justify-content-center py-1">
                <a
                  type="button"
                  className="btn btn-light border"
                  style={{
                    width: "400px",
                  }}
                  href="/#"
                  onClick={() => {
                    dispatch(showWebMap());
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-map"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.502.502 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103zM10 1.91l-4-.8v12.98l4 .8V1.91zm1 12.98 4-.8V1.11l-4 .8v12.98zm-6-.8V1.11l-4 .8v12.98l4-.8z"
                    />
                  </svg>
                  View Project as Web Map
                </a>
              </div>

              <div className="row justify-content-center py-1">
                <a
                  href="/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities"
                  type="button"
                  className="btn btn-light border"
                  style={{
                    width: "400px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-cloud"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                  </svg>
                  Open WMS (GetCapabilities)
                </a>
              </div>
              <div className="row justify-content-center py-1">
                <a
                  href="/cgi-bin/qgis_mapserv.fcgi?SERVICE=WFS&VERSION=1.3.0&REQUEST=GetCapabilities"
                  type="button"
                  className="btn btn-light border"
                  style={{
                    width: "400px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-cloud"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                  </svg>
                  Open WFS (GetCapabilities)
                </a>
              </div>
              <div className="row justify-content-center py-1">
                <a
                  href="/cgi-bin/qgis_mapserv.fcgi?SERVICE=WCS&VERSION=1.3.0&REQUEST=GetCapabilities"
                  type="button"
                  className="btn btn-light border"
                  style={{
                    width: "400px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-cloud"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                  </svg>
                  Open WCS (GetCapabilities)
                </a>
              </div>

              <HostedLayers />
            </div>

            <div className="p-4 col border">
              <h3>About this deployment...</h3>
              <img
                src={`/cgi-bin/qgis_mapserv.fcgi?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX=-90,-180,90,180&WIDTH=1920&HEIGHT=1080&SRS=epsg:4326&LAYERS=${wfsLayers
                  .concat(wcsLayers)
                  .map((layer) => layer.name)
                  .reverse()
                  .join(",")}`}
                alt="Map Preview"
                className="w-100"
              />
              <p className="pt-3 w-100 text-break" id="description">
                {wmsInfo.WMS_Capabilities.Service.Abstract}
              </p>
            </div>
          </div>
          <Recommendations/>
        </div>
      );
    } catch (err) {
      console.log(err);
      dispatch(reportInvalidWMS());
    }
  } else {
    return (
      <div>
        <div className="row">
          <h1 className="text-center py-2">
            Invalid geoCML Server Configuration
          </h1>
        </div>
        <div className="row px-5 py-4">
          <p className="text-center">
            If you're reading this message, you have successfully deployed
            geoCML Server and geoCML Server Portal. Unfortunately, geoCML Server
            Portal is unable to display any information about your geoCML
            Deployment because of an invalid WMS configuration.
          </p>
        </div>
        { !isMobile ? (
        <div className="row">
          <p className="py-4 text-center">
            Follow these instructions to configure geoCML Server Portal:
          </p>
          <ol
            className="bg-primary p-5 text-white"
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              width: "40%",
              fontWeight: "bold",
            }}
          >
            <li>Navigate to geoCML Desktop.</li>
            <li>
              In QGIS, connect to geocml_db via geocml-postgres:5432.
              <ol>
                <li>Authenticate your connection as the user 'geocml'.</li>
                <li>
                  Click the 'Store' checkbox next to the username and password
                  input boxes.
                </li>
                <li>Click OK.</li>
              </ol>
            </li>
            <li>
              Add at least one layer from geocml_db to geocml-project.qgz.
            </li>
            <li>
              Click Project {">"} Properties {">"} QGIS Server.
            </li>
            <li>
              Fill in the following details:
              <ul>
                <li>
                  Title: The title displayed at the top of geoCML Server Portal.
                </li>
                <li>
                  Organization: The organization responsible for this
                  deployment.
                </li>
                <li>
                  Email: The administrator for this deployment's email address.
                </li>
                <li>
                  Phone: The administrator for this deployment's phone number.
                </li>
                <li>Abstract: A long-form description of your deployment.</li>
                <li>
                  Fees: Any fees associated with accessing the data hosted in
                  this deployment.
                </li>
                <li>
                  Access contraints: Copyright claims the data hosted in this
                  deployment.
                </li>
              </ul>
            </li>
            <li>Click OK.</li>
          </ol>
        </div>
        ) : (
        <div></div>
        ) }
      </div>
    );
  }
}

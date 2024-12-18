import { useSelector, useDispatch } from "react-redux";
import { reportInvalidWMS } from "../app-slice";

export function HostedLayers() {
  const dispatch = useDispatch();
  const wfsLayers = useSelector((state) => state.app.wfsLayers);
  const wcsLayers = useSelector((state) => state.app.wcsLayers);

  try {
    return (
      <div className="px-2 py-5">
        <h3 className="row justify-content-center">Hosted Layers</h3>
        <table className="table py-2">
          <thead>
            <tr>
              <th>Layer Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {wfsLayers.map((layer) => {
              return (
                <tr>
                  <td className="w-50">{layer.name}</td>
                  <td className="w-50">
                    <a
                      type="button"
                      className="btn btn-light border"
                      style={{
                        width: "100%",
                      }}
                      href={`/cgi-bin/qgis_mapserv.fcgi?SERVICE=WFS&VERSION=1.3.0&REQUEST=GetFeature&TYPENAME=${layer.name}`}
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
                      Open WFS (GetFeature)
                    </a>
                  </td>
                </tr>
              );
            })}

            {wcsLayers.map((layer) => {
              return (
                <tr>
                  <td className="w-50">{layer.name}</td>
                  <td className="w-50">
                    <a
                      type="button"
                      className="btn btn-light border"
                      style={{
                        width: "100%",
                      }}
                      href={`/cgi-bin/qgis_mapserv.fcgi?SERVICE=WCS&VERSION=1.3.0&REQUEST=DescribeCoverage&COVERAGE=${layer.name}`}
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
                      Open WCS (DescribeCoverage)
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } catch (err) {
    console.log(err);
    dispatch(reportInvalidWMS());
  }
}

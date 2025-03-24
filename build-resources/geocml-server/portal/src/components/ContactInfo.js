import { useSelector, useDispatch } from "react-redux";
import { reportInvalidWMS } from "../app-slice";

export function ContactInfo() {
  const dispatch = useDispatch();
  const wmsInfo = useSelector((state) => state.app.wmsInfo);

  try {
    return (
      <table id="contact-info">
        <thead>
          <th>Contact Information</th>
        </thead>
        <tbody>
          <tr>
            <td id="email">
              {
                wmsInfo.WMS_Capabilities.Service.ContactInformation
                  .ContactElectronicMailAddress
              }
            </td>
          </tr>

          <tr>
            <td id="organization">
              {
                wmsInfo.WMS_Capabilities.Service.ContactInformation
                  .ContactPersonPrimary.ContactOrganization
              }
            </td>
          </tr>

          <tr>
            <td id="phone-number">
              Ph.{" "}
              {
                wmsInfo.WMS_Capabilities.Service.ContactInformation
                  .ContactVoiceTelephone
              }
            </td>
          </tr>
        </tbody>
      </table>
    );
  } catch (err) {
    console.log(err);
    dispatch(reportInvalidWMS());
  }
}

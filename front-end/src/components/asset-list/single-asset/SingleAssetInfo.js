//controls all rendering of a single assets basic information

import renderLocation from "../../../utils/renderLocation";

function SingleAssetInfo({ singleAsset }) {
  
  return (
    <>
      <h3>Info</h3>
      {singleAsset.length !== 0 &&
      <table>
        <tbody>
          <tr>
            <td>
              <b>Asset Tag</b>
            </td>
            <td>{singleAsset.asset_tag}</td>
          </tr>
          <tr>
            <td>
              <b>Site</b>
            </td>
            <td>{singleAsset.location.site}</td>
          </tr>
          <tr>
            <td>
              <b>IP</b>
            </td>
            <td>{singleAsset.location.site_loc === '' ? 'Needs Verified' : renderLocation(singleAsset)}</td>
          </tr>
          <tr>
            <td>
              <b>Serial Number</b>
            </td>
            <td>{singleAsset.serial_number}</td>
          </tr>
          <tr>
            <td>
              <b>Make</b>
            </td>
            <td>{singleAsset.make}</td>
          </tr>
          <tr>
            <td>
              <b>Model</b>
            </td>
            <td>{singleAsset.model}</td>
          </tr>
          <tr>
            <td>
              <b>Hash Rate</b>
            </td>
            <td>{singleAsset.hr}</td>
          </tr>
          <tr>
            <td>
              <b>Status</b>
            </td>
            <td>{singleAsset.status}</td>
          </tr>
          <tr>
            <td>
              <b>Invoice Number</b>
            </td>
            <td>{singleAsset.invoice_num ? singleAsset.invoice_num: '--'}</td>
          </tr>
          <tr>
            <td>
              <b>Value</b>
            </td>
            <td>{singleAsset.value ? singleAsset.value: '--'}</td>
          </tr>
          <tr>
            <td>
              <b>EOL Date</b>
            </td>
            <td>{singleAsset.EOL_date ? singleAsset.EOL_date: '--'}</td>
          </tr>
        </tbody>
      </table>
      }
    </>
  );
}

export default SingleAssetInfo;

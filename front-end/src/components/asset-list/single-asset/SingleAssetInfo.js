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
            <td>{singleAsset[0].asset_tag}</td>
          </tr>
          <tr>
            <td>
              <b>Site</b>
            </td>
            <td>{singleAsset[0].location.site}</td>
          </tr>
          <tr>
            <td>
              <b>IP</b>
            </td>
            <td>{singleAsset[0].location.site_loc === '' ? 'Needs Verified' : renderLocation(singleAsset[0])}</td>
          </tr>
          <tr>
            <td>
              <b>Serial Number</b>
            </td>
            <td>{singleAsset[0].serial_number}</td>
          </tr>
          <tr>
            <td>
              <b>Make</b>
            </td>
            <td>{singleAsset[0].make}</td>
          </tr>
          <tr>
            <td>
              <b>Model</b>
            </td>
            <td>{singleAsset[0].model}</td>
          </tr>
          <tr>
            <td>
              <b>Hash Rate</b>
            </td>
            <td>{singleAsset[0].hr}</td>
          </tr>
          <tr>
            <td>
              <b>Status</b>
            </td>
            <td>{singleAsset[0].status}</td>
          </tr>
          <tr>
            <td>
              <b>Invoice Number</b>
            </td>
            <td>{singleAsset[0].invoice_num ? singleAsset[0].invoice_num: '--'}</td>
          </tr>
          <tr>
            <td>
              <b>Value</b>
            </td>
            <td>{singleAsset[0].value ? singleAsset[0].value: '--'}</td>
          </tr>
          <tr>
            <td>
              <b>EOL Date</b>
            </td>
            <td>{singleAsset[0].EOL_date ? singleAsset[0].EOL_date: '--'}</td>
          </tr>
        </tbody>
      </table>
      }
    </>
  );
}

export default SingleAssetInfo;

import { useEffect, useState } from "react";
import LoaderSpinner from "../LoaderSpinner";
import "./UploadSuccess.css";

function UploadSuccess({ rejectedLog, newAssets }) {
  let percentOfSuccess = 0,
    percentOfFails = 0;
  const [totalAmtOfUploads, setTotalAmtOfUploads] = useState();
  console.log(rejectedLog, newAssets)
  useEffect(() => {
    if(rejectedLog && newAssets){
      setTotalAmtOfUploads(newAssets.length + rejectedLog.length);
      const calcSuccessFailure = () => {
        percentOfSuccess = newAssets.length / totalAmtOfUploads;
        percentOfFails = rejectedLog ? rejectedLog.length / totalAmtOfUploads : 0 / totalAmtOfUploads;
      };
      calcSuccessFailure();
    }
  }, [rejectedLog, newAssets]);
  console.log(totalAmtOfUploads)

  return (
    <div className="upload-success-log">
      {totalAmtOfUploads &&
      <>
      <h5 className="log-header">[ Upload Log ]</h5>

      <hr />
      <h3>Total Uploads : {totalAmtOfUploads}</h3>
      <h6>
        Successes: {newAssets && newAssets.length}
        <span className="success-green">
          ({(percentOfSuccess * 100.0).toFixed(2)}%)
        </span>
        &nbsp;·&nbsp;Failures: {rejectedLog ? rejectedLog.length : 0}
        <span className="fail-red">
          ({(percentOfFails * 100.0).toFixed(2)}%)
        </span>
      </h6>
      <p>
        [Line 1] Headers: <span className="success-green">Valid</span>
      </p>
      <hr />
      {newAssets && newAssets.length !== 0 &&
        newAssets.map((asset, key) => {
          const locationData = asset.location.site_loc;
          return (
            <div key={`div1 ${key}`}>
              <p key={`p1 ${key}`}>
                {asset.location.csv_index && (
                <span key={`linespan ${key}`} className="line-span">
                  [Line {asset.location.csv_index}]
                </span>)}
                {locationData.first_octet}.{locationData.mdc}.{locationData.shelf}.{locationData.unit}&nbsp;·&nbsp;
                {asset.serial_number}&nbsp;·&nbsp;
                {asset.asset_tag}&nbsp;·&nbsp;
                {asset.make}&nbsp;·&nbsp;
                {asset.model}&nbsp;·&nbsp;
                {asset.hr}:
                <span className="success-green" key={`success-green ${key}`}>Uploaded Successfully!</span>
              </p>
              <hr />
            </div>
          );
        })}
      <br />
      {rejectedLog &&
        rejectedLog.map((rejected, key) => {
          return (
            <div key={`div2 ${key}`}>
              <p key={`p2 ${key}`}>
              {rejected.location.csv_index && (
                <span className="line-span" key={`linespan2 ${key}`}>
                  [Line {rejected.location.csv_index}]
                </span>
              )}
                {rejected.serial_number}&nbsp;·&nbsp;
                {rejected.asset_tag}&nbsp;·&nbsp;
                {rejected.make}&nbsp;·&nbsp;
                {rejected.model}&nbsp;·&nbsp;
                {rejected.hr}:
                <span className="fail-red" key={`failred ${key}`}>Upload Failed!</span> ({rejected.reject_err})
              </p>
              <hr />
            </div>
          );
        })}</>}
    </div>
  );
}

export default UploadSuccess;

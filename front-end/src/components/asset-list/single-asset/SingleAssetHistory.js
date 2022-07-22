import "./SingleAssetHistory.css";
import { useState, useEffect } from "react";

//util
import dateFormatter from "../../../utils/dateFormatter";
//controls all rendering of a single assets history
function SingleAssetHistory({ singleAsset }) {
  const [singleAssetHistory, setSingleAssetHistory] = useState(null);

  useEffect(() => {
    if (singleAsset) {
      setSingleAssetHistory(singleAsset[0].history);
    }
  }, [singleAsset]);

  return (
    <>
      <h3>History</h3>
      {singleAssetHistory && singleAssetHistory !== 0 && (
        <table className="shrink-font">
          <tbody>
            <tr>
              <th>
                <b>Date of Action</b>
              </th>
              <th>
                <b>Action Taken</b>
              </th>
              <th>
                <b>Action By</b>
              </th>
              <th>
                <b>Comments</b>
              </th>
            </tr>
            {singleAssetHistory.map((singleHist, key) => {
              return (
                <tr key={key}>
                  <td>{dateFormatter(singleHist.action_date)}</td>
                  <td>{singleHist.action_taken}</td>
                  <td>{singleHist.action_by}</td>
                  <td>{singleHist.action_comment}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}

export default SingleAssetHistory;

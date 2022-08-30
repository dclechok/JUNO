import "./SingleAssetHistory.css";
import { useState, useEffect } from "react";

//util
import dateFormatter from "../../../utils/dateFormatter";
//controls all rendering of a single assets history
function SingleAssetHistory({ singleAsset }) {
  const [singleAssetHistory, setSingleAssetHistory] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    if (singleAsset) {
      setSingleAssetHistory(singleAsset.history);
    }
    return () => abortController.abort();
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
            {singleAssetHistory
              .sort((a, b) =>
                b.action_date.toString().localeCompare(a.action_date.toString())
              )
              .map((singleHist, key) => {
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

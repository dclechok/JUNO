import "./SingleHistory.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

//utils
import dateFormatter from "../../utils/dateFormatter";
import colorCode from "../../utils/colorCodes";
//renders a single viewable historical entry
function SingleHistory({ assetList }) {
  const { history_key } = useParams();

  const [loadedHistory, setLoadedHistory] = useState(null);

  const sortButtonSubmit = () => {
    console.log("sort");
  };

  useEffect(() => {
    //load data via history_key
    if (assetList && assetList.length !== 0)
      setLoadedHistory(
        assetList.filter((asset) => {
          return asset.history.action_key === history_key;
        })
      );
  }, []);
  return (
    <div className="single-asset-render">
      <h1>Details For Log</h1>
      {loadedHistory && (
        <>
          <header className="single-asset-header container-style">
            <div>
              <p>Action Logged: <span style={{color: colorCode[loadedHistory[0].history.action_taken]}}>{loadedHistory[0].history.action_taken}</span></p>
              <p>Logged By: {loadedHistory[0].history.action_by}</p>
              <p>Approved By: --</p>
              <p>
                Logged Date:{" "}
                {dateFormatter(loadedHistory[0].history.action_date)}
              </p>
              <p>Total Assets Mutated: {loadedHistory.length}</p>
              <p>History Key: {history_key}</p>
            </div>
          </header>
          <div className="container-style">
            <header></header>
            <table>
              <tbody>
                <tr>
                  <th>
                    <button id="asset_tag" onClick={sortButtonSubmit}>
                      Asset Tag
                    </button>
                  </th>
                  <th>
                    <button id="site" onClick={sortButtonSubmit}>
                      Site
                    </button>
                  </th>
                  <th>IP</th>
                  <th>Serial #</th>
                  <th>
                    <button id="make" onClick={sortButtonSubmit}>
                      Make
                    </button>
                  </th>
                  <th>
                    <button id="model" onClick={sortButtonSubmit}>
                      Model
                    </button>
                  </th>
                  <th>
                    <button id="hr" onClick={sortButtonSubmit}>
                      Hash Rate
                    </button>
                  </th>
                  <th>
                    <button id="status" onClick={sortButtonSubmit}>
                      Status
                    </button>
                  </th>
                  <th>
                    <button id="updated_at" onClick={sortButtonSubmit}>
                      Last Updated
                    </button>
                  </th>
                  <th>
                    <button id="updated_at" onClick={sortButtonSubmit}>
                      View Prior History
                    </button>
                  </th>
                </tr>
                {loadedHistory && loadedHistory.length !== 0 &&
                <tr>
                    <td>
                        {loadedHistory[0].asset_tag}
                    </td>
                    <td>
                        {loadedHistory[0].location.site}
                    </td>
                    <td>
                        {loadedHistory[0].location.site_loc === '' ? 'Needs Verified' : loadedHistory[0].location.site_loc}
                    </td>
                    <td>
                        {loadedHistory[0].serial_number}
                    </td>
                    <td>
                        {loadedHistory[0].make}
                    </td>
                    <td>
                        {loadedHistory[0].model}
                    </td>
                    <td>
                        {loadedHistory[0].hr}
                    </td>
                    <td>
                        {loadedHistory[0].status}
                    </td>
                    <td>
                        {dateFormatter(loadedHistory[0].updated_at)}
                    </td>
                    <td>
                        [View]
                    </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default SingleHistory;

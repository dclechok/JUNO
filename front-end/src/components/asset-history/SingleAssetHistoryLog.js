import { useParams, useNavigate } from "react-router-dom";

//utils
import dateFormatter from "../../utils/dateFormatter";
import colorCode from "../../utils/colorCodes";
import { useEffect, useState } from "react";
import LoaderSpinner from "../LoaderSpinner";

function SingleAssetHistoryLog({ loadedHistory }) {
  const { history_key } = useParams();
  const navigate = new useNavigate();
  const [currentHistoryLog, setCurrentHistoryLog] = useState(null); //current historical action we're looking at

  const onClickHandler = (e) => {
    const { id } = e.currentTarget;
    navigate(`/${id}`);
  };

  const sortButtonSubmit = (e) => {
    e.preventDefault();
  };
  console.log(loadedHistory)
  useEffect(() => {
    const abortController = new AbortController();
    async function loadHistoryLog() {
      if (loadedHistory[0]) {
        setCurrentHistoryLog(
          ...loadedHistory[0].history.filter(
            (log) => log.action_key === history_key
          )
        );
      }
    }
    loadHistoryLog();
    return () => abortController.abort();
  }, [loadedHistory, history_key]);
  console.log(currentHistoryLog)
  return (
    <>
      {currentHistoryLog ? (
        <>
          <header className="single-history-header container-style">
            <div>
              <p>
                <b>Action Logged</b>:{" "}
                <span
                  style={{
                    color: colorCode[currentHistoryLog.action_taken],
                  }}
                >
                  {currentHistoryLog.action_taken}
                </span>
              </p>
              <p>
                <b>Logged By</b>: {currentHistoryLog.action_by}
              </p>
              <p>
                <b>Approved By</b>: --
              </p>
              <p>
                <b>Logged Date</b>:{" "}
                {dateFormatter(currentHistoryLog.action_date)}
              </p>
              <p>
                <b>Total Assets Mutated</b>: {loadedHistory.length}
              </p>
              <p>
                <b>History Key</b>: {history_key}
              </p>
            </div>
          </header>
          <div className="container-style">
            <table className="history-table">
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
                  <th>Details</th>
                </tr>
                {loadedHistory &&
                  loadedHistory.length !== 0 &&
                  loadedHistory.map((asset, key) => {
                    return (
                      <tr key={key}>
                        <td>{asset.asset_tag}</td>
                        <td>{asset.location.site}</td>
                        <td>
                          {asset.location.site_loc === ""
                            ? "Needs Verified"
                            : `${asset.location.site_loc.first_octet}.${asset.location.site_loc.mdc}.${asset.location.site_loc.shelf}.${asset.location.site_loc.unit}`}
                        </td>
                        <td>{asset.serial_number}</td>
                        <td>{asset.make}</td>
                        <td>{asset.model}</td>
                        <td>{asset.hr}</td>
                        <td>{asset.status}</td>
                        <td>{dateFormatter(asset.updated_at)}</td>
                        <td>
                          <span style={{ color: "black" }}>
                            [
                            <button
                              className="button-link"
                              id={asset.asset_id}
                              onClick={onClickHandler}
                            >
                              View
                            </button>
                            ]
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <LoaderSpinner />
      )}
    </>
  );
}

export default SingleAssetHistoryLog;

import { useParams, useNavigate } from "react-router-dom";

//utils
import dateFormatter from "../../utils/dateFormatter";
import colorCode from "../../utils/colorCodes";

function SingleAssetHistoryLog({ loadedHistory }) {
  const { history_key } = useParams();
  const navigate = new useNavigate();

  const onClickHandler = (e) => {
    const { id } = e.currentTarget;
    navigate(`/${id}`);
  };

  const sortButtonSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <header className="single-history-header container-style">
        <div>
          <p>
            <b>Action Logged</b>:{" "}
            <span
              style={{
                color: colorCode[loadedHistory[0].history.action_taken],
              }}
            >
              {loadedHistory[0].history.action_taken}
            </span>
          </p>
          <p>
            <b>Logged By</b>: {loadedHistory[0].history.action_by}
          </p>
          <p>
            <b>Approved By</b>: --
          </p>
          <p>
            <b>Logged Date</b>:{" "}
            {dateFormatter(loadedHistory[0].history.action_date)}
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
                        : asset.location.site_loc}
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
                          id={asset.asset_tag}
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
  );
}

export default SingleAssetHistoryLog;
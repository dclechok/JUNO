import { useNavigate, useParams } from "react-router-dom";

//components
import LoaderSpinner from "../LoaderSpinner";
//utils
import dateFormatter from "../../utils/dateFormatter";
import colorCode from "../../utils/colorCodes";
import { useEffect, useState } from "react";

function SingleJobSiteHistoryLog({ loadedHistory }) {
  const navigate = new useNavigate();
  const { history_key } = useParams();
  const [currentHistoryLog, setCurrentHistoryLog] = useState(null); //current historical action we're looking at
  //render a job sites historical data? what besides create/delete?
  const onClickHandler = (e) => {
    const { id } = e.currentTarget;
    navigate(`/${id}`);
  };

  const sortButtonSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    async function loadHistoryLog(){
      if (loadedHistory[0]) {
        setCurrentHistoryLog(
          ...loadedHistory[0].history.filter(
            (log) => log.action_key === history_key
          )
        );
      }
    }
    loadHistoryLog();

  }, [loadedHistory]);

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
                <b>History Key</b>: {currentHistoryLog.action_key}
              </p>
            </div>
          </header>
          <div className="container-style">
            <table className="history-table">
              <tbody>
                <tr>
                  <th>
                    <button id="physical_site_name" onClick={sortButtonSubmit}>
                      Physical Site
                    </button>
                  </th>
                  <th>
                    <button id="physical_site_id" onClick={sortButtonSubmit}>
                      Physical Site ID
                    </button>
                  </th>
                  <th>
                    <button id="site_code" onClick={sortButtonSubmit}>
                      Site Code
                    </button>
                  </th>
                  <th>
                    <button id="updated_at" onClick={sortButtonSubmit}>
                      Date of Action
                    </button>
                  </th>
                  <th>
                    <button id="updated_at" onClick={sortButtonSubmit}>
                      Action Details
                    </button>
                  </th>
                  <th>Details</th>
                </tr>
                {loadedHistory[0] && currentHistoryLog && (
                  <tr>
                    <td>{loadedHistory[0].physical_site_name}</td>
                    <td>{loadedHistory[0].physical_site_loc}</td>
                    <td>{loadedHistory[0].site_code}</td>
                    <td>{dateFormatter(currentHistoryLog.action_date)}</td>
                    <td>{currentHistoryLog.action_comment}</td>
                    <td>
                      <span style={{ color: "black" }}>
                        [<button className="button-link">View</button>]
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <LoaderSpinner message={"History Log"} />
      )}
    </>
  );
}

export default SingleJobSiteHistoryLog;

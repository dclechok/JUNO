import { useNavigate, useParams } from "react-router-dom";

//components
import LoaderSpinner from "../LoaderSpinner";
//utils
import dateFormatter from "../../utils/dateFormatter";
import colorCode from "../../utils/colorCodes";
import { useEffect, useState } from "react";

function SingleUserHistoryLog({ loadedHistory }){
    const navigate = new useNavigate();
    const { history_key } = useParams();

    const [currentHistoryLog, setCurrentHistoryLog] = useState();

    useEffect(() => {
      const abortController = new AbortController();
        async function loadHistoryLog(){
          if (loadedHistory[0]) {
            setCurrentHistoryLog(
              ...loadedHistory[0].history.filter(
                (log) => log.history_key === history_key
              )
            );
          }
        }
        loadHistoryLog();
        return abortController.abort();
      }, [loadedHistory]);
    
    //render a job sites historical data? what besides create/delete?
    const onClickHandler = (e) => {
      const { id } = e.currentTarget;
      navigate(`/${id}`);
    };
  
    const sortButtonSubmit = (e) => {
      e.preventDefault();
    };

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
                <p><b>Status:</b> {currentHistoryLog.status}</p>
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
                  <b>History Key</b>: {currentHistoryLog.history_key}
                </p>
              </div>
            </header>
            <div className="container-style">
              <table className="history-table">
                <tbody>
                  <tr>
                    <th>
                        User ID
                    </th>
                    <th>
                      <button id="physical_site_name" onClick={sortButtonSubmit}>
                        User Name
                      </button>
                    </th>
                    <th>
                      <button id="physical_site_id" onClick={sortButtonSubmit}>
                        User
                      </button>
                    </th>
                    <th>
                      <button id="updated_at" onClick={sortButtonSubmit}>
                        Date of Action
                      </button>
                    </th>
                    <th>Details</th>
                    <th>Action By</th>
                  </tr>
                  {loadedHistory[0] && currentHistoryLog && (
                    <tr>
                      <td>{loadedHistory[0].user_id}</td>
                      <td>{loadedHistory[0].username}</td>
                      <td>{loadedHistory[0].name}</td>
                      <td>{dateFormatter(currentHistoryLog.action_date)}</td>
                      <td>{currentHistoryLog.action_taken}</td>
                      <td>{currentHistoryLog.action_by}</td>
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

export default SingleUserHistoryLog;
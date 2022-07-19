import { useNavigate } from "react-router-dom";

//utils
import dateFormatter from "../../utils/dateFormatter";
import colorCode from "../../utils/colorCodes";

function SingleJobSiteHistoryLog({ loadedHistory }) {
  const navigate = new useNavigate();

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
            <b>History Key</b>: {loadedHistory[0].history.action_key}
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
                <button id="updated_at" onClick={sortButtonSubmit}>
                  Last Updated
                </button>
              </th>
              <th>
                <button id="updated_at" onClick={sortButtonSubmit}>
                  Comments
                </button>
              </th>
              <th>Details</th>
            </tr>
            {loadedHistory &&
              loadedHistory.length !== 0 &&
              loadedHistory.map((jobSite, key) => {
                return (
                  <tr key={key}>
                    <td>{jobSite.physical_site_name}</td>
                    <td>{jobSite.physical_site_loc}</td>
                    <td>{dateFormatter(jobSite.updated_at)}</td>
                    <td>{jobSite.history.action_comment}</td>
                    <td>
                      <span style={{ color: "black" }}>
                        [
                        <button
                          className="button-link"
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

export default SingleJobSiteHistoryLog;

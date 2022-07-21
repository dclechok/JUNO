import "./ViewSites.css";
import { useState, useEffect } from "react";
import deletePng from "../../images/delete.png";
//utils
import dateFormatter from "../../utils/dateFormatter";
import { getJobSites } from "../../utils/api";
import { deactivateJobSite } from "../../utils/api";
import LoaderSpinner from "../LoaderSpinner";

function ViewSites({ accountLogged }) {
  const [jobSites, setJobSites] = useState(null);
  const [loadJobSites, setLoadJobSites] = useState();

  useEffect(() => {
    async function fetchJobSites() {
      setJobSites(await getJobSites());
    }
    fetchJobSites();
  }, [loadJobSites, setLoadJobSites]);

  const onClickHandler = (e) => {
    const { id } = e.currentTarget;
    const oldJobSiteHistory = jobSites.filter(
      (js) => js.physical_site_id === Number(id)
    );
    if (oldJobSiteHistory.status !== "Active")
      window.alert("This job site is already deactivated!");
    else {
      if (accountLogged.account[0].access_level === "admin") {
        if (window.confirm("Would you like to deactivate this job site? (This currently cannot be undon.)")) {
          async function removeJobSite() {
            setLoadJobSites(
              await deactivateJobSite(
                id,
                accountLogged,
                oldJobSiteHistory[0].history
              )
            );
          }
          removeJobSite();
        }
      }
    }
  };

  return (
    <>
      {jobSites && jobSites.length !== 0 ? (
        <table className="shrink-font">
          <tbody>
            <tr>
              <th>
                <b>Job Site</b>
              </th>
              <th>
                <b>Site ID</b>
              </th>
              <th>
                <b>Created By</b>
              </th>
              <th>
                <b>Date Created</b>
              </th>
              <th>
                <b>Status</b>
              </th>
              <th>
                <b>Deactivate Site</b>
              </th>
            </tr>
            {jobSites &&
              jobSites.length !== 0 &&
              jobSites.map((site, key) => {
                return (
                  <tr key={key}>
                    <td>{site.physical_site_name}</td>
                    <td>{site.physical_site_loc}</td>
                    <td>{accountLogged.account[0].name}</td>
                    <td>{dateFormatter(site.updated_at)}</td>
                    <td>{site.status}</td>
                    <td className="delete-icon-td">
                      <button
                        className="image-button"
                        onClick={onClickHandler}
                        id={site.physical_site_id}
                      >
                        <img src={deletePng} alt="delete job site" />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      ) : (
        <div>
          <LoaderSpinner width={45} height={45} message="Job Sites" />
          <h6>Searching for active Job Sites..</h6>
        </div>
      )}
    </>
  );
}

export default ViewSites;

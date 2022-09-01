import { useState, useEffect } from "react";
import './ViewSites.css';
//icons
import deletePng from "../../../images/delete.png";
import editPng from "../../../images/pencil-blue-icon.png";
//utils
import dateFormatter from "../../../utils/dateFormatter";
import colorCode from "../../../utils/colorCodes";
import { getJobSites } from "../../../utils/api";
import { deactivateJobSite } from "../../../utils/api";
import LoaderSpinner from "../../LoaderSpinner";
import generateHistoryKey from "../../../utils/generateHistoryKey";

function ViewSites({ setViewOrCreate, accountLogged, setJobSiteID }) {
  const [jobSites, setJobSites] = useState(null);
  const [loadJobSites, setLoadJobSites] = useState();
  const [deactivateSuccess, setDeactivateSuccess] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    async function fetchJobSites() {
      setJobSites(await getJobSites());
    }
    fetchJobSites();
    return () => abortController.abort();
  }, [loadJobSites, setLoadJobSites, deactivateSuccess, setDeactivateSuccess]);

  const onClickEditHandler = (e) => {
    const { id, value } = e.currentTarget;
    if (id === "editSite") {
      setJobSiteID(Number(value));
      jobSites.find((js) => js.physical_site_id === Number(value)).status ===
        "Active"
        ? setViewOrCreate("edit")
        : window.alert("You currently cannot edit a deactivated site!");
    }
  };

  const onClickHandler = (e) => {
    const { id } = e.currentTarget;
    const oldJobSite = jobSites.find(
      (js) => js.physical_site_id === Number(id)
    );
    if (oldJobSite.status !== "Active")
      window.alert("This job site is already deactivated!");
    else {
      if (accountLogged.account[0].access_level === "admin") {
        if (
          window.confirm(
            "Would you like to deactivate this job site? (This currently cannot be undone.)"
          )
        ) {
          async function removeJobSite() {
            const newDate = new Date();
            setLoadJobSites(
              setDeactivateSuccess(await deactivateJobSite(
                id,
                {
                  ...oldJobSite,
                  history: [
                    ...oldJobSite.history,
                    {
                      action_taken: "Deactivate Job Site",
                      action_date: JSON.stringify(newDate),
                      action_by: accountLogged.account[0].name,
                      action_by_id: accountLogged.account[0].user_id,
                      action_key: generateHistoryKey(),
                      action_comment: "Deactivated Job Site"
                    }
                  ],
                  status: "Non-Active",
                  updated_at: newDate,

                }
              )
              )
            );
          }
          removeJobSite();
        }

      }
    }
  };

  useEffect(() => {
    if (deactivateSuccess)
      //change status of all devices belonging to job site to "Pending Transfer"
      //strip location data from device except "site" ie. "Midland, PA"
      console.log('Pending Transfer')
  }, [deactivateSuccess]);

  return (
    <>
      {jobSites && jobSites.length !== 0 ? (
        <table className="shrink-font admin-panel-container">
          <tbody>
            <tr>
              <th>
                <b>ID</b>
              </th>
              <th>
                <b>Site Name</b>
              </th>
              <th>
                <b>Site Code</b>
              </th>
              <th>
                <b>Category</b>
              </th>
              <th>
                <b>First Octet</b>
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
                <b>Edit</b>
              </th>
              <th>
                <b>Deactivate</b>
              </th>
            </tr>
            {jobSites &&
              jobSites.length !== 0 &&
              jobSites.map((site, key) => {
                return (
                  <tr key={key}>
                    <td>{site.physical_site_id}</td>
                    <td>{site.physical_site_name}</td>
                    <td>{site.site_code}</td>
                    <td>{site.category.toUpperCase()}</td>
                    <td>{site.first_octet}</td>
                    <td>{accountLogged.account[0].name}</td>
                    <td>{dateFormatter(site.updated_at)}</td>
                    <td>
                      <span style={{ color: colorCode[site.status] }}>
                        {site.status}
                      </span>
                    </td>
                    <td className="delete-icon-td">
                      <button
                        className="image-button"
                        id="editSite"
                        value={site.physical_site_id}
                        onClick={onClickEditHandler}
                      >
                        <img src={editPng} alt="edit user" />
                      </button>
                    </td>
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
        </div>
      )}
    </>
  );
}

export default ViewSites;

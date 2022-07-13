import { useState, useEffect } from "react";

//utils
import dateFormatter from "../../utils/dateFormatter";
import { getJobSites } from "../../utils/api";

function ViewSites() {
  const [jobSites, setJobSites] = useState(null);

  useEffect(() => {
    async function fetchJobSites() {
      setJobSites(await getJobSites());
    }
    fetchJobSites();
  }, []);

  return (
    <table className="shrink-font">
      <tbody>
        <tr>
          <th>
            <b>Job Site</b>
          </th>
          <th>
            <b>Physical Site ID</b>
          </th>
          <th>
            <b>Created By</b>
          </th>
          <th>
            <b>Date Created</b>
          </th>
        </tr>
        {jobSites &&
          jobSites.length !== 0 &&
          jobSites.map((site, key) => {
            return (
              <tr key={key}>
                <td>{site.physical_site_name}</td>
                <td>{site.physical_site_loc}</td>
                <td>Dan Lechok</td>
                <td>{dateFormatter(site.updated_at)}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

export default ViewSites;

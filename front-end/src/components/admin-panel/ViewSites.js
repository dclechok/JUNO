import './ViewSites.css';
import { useState, useEffect } from "react";
import deletePng from '../../images/delete.png'
//utils
import dateFormatter from "../../utils/dateFormatter";
import { getJobSites } from "../../utils/api";
import { deleteJobSite } from '../../utils/api';
import LoaderSpinner from '../LoaderSpinner';

function ViewSites() {
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
    if(window.confirm('Would you like to permanently remove this job site from the JUNO database?')){
      async function removeJobSite(){
        setLoadJobSites(await deleteJobSite(id));
        
      }
      removeJobSite();
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
                <b>Physical Site ID</b>
              </th>
              <th>
                <b>Created By</b>
              </th>
              <th>
                <b>Date Created</b>
              </th>
              <th>
                <b>Delete Site</b>
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
                    <td className="delete-icon-td"><button className='image-button' onClick={onClickHandler} id={site.physical_site_id}><img src={deletePng} alt="delete job site" /></button></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      ) : <LoaderSpinner width={45} height={45} message="Job Sites" />}
    </>
  );
}

export default ViewSites;
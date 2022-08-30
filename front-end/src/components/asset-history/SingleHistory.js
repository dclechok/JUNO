import "./SingleHistory.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

//utils
import { getJobSites } from "../../utils/api";
import { getUsers } from "../../utils/api";

//components
import SingleAssetHistoryLog from "./SingleAssetHistoryLog"; //render single asset history log
import SingleJobSiteHistoryLog from "./SingleJobSiteHistoryLog";
import SingleUserHistoryLog from "./SingleUserHistoryLog";

//renders a single viewable historical entry
function SingleHistory({ assetList, searchHistoryType }) {
  const { history_key } = useParams();
  const [loadedHistory, setLoadedHistory] = useState(null);
  useEffect(() => {
    //load data via history_key
    //check assets for key(s) (assets are already loaded)
    const abortController = new AbortController();
    if (
      searchHistoryType &&
      (searchHistoryType === "Single Upload" ||
        searchHistoryType === "Bulk Upload" || searchHistoryType === "Edit Asset") 
    ) {
      if (assetList && assetList.length !== 0) {
        if (
          assetList.find((asset) =>
            asset.history.filter(
              (assetHist) => assetHist.action_key === history_key ))
        )
        setLoadedHistory(
          assetList.filter((asset) => asset.history.find(assetHist => assetHist.action_key === history_key)));
      }
    }
    else if (searchHistoryType && searchHistoryType.includes("Job Site")) {
      //create or deactivate 'job site'
      async function fetchJobSites() {
        const jobSites = await getJobSites();
        //filter through job sites one by one, and then through each of their individual history entries
        if (jobSites && jobSites.length !== 0) {
          if (
            jobSites.find((js) =>
              js.history.find((jsHist) => jsHist.action_key === history_key)
            )
          ) {
            //set loaded history a to jobsite that has a history entry that matches history key
            setLoadedHistory(
              jobSites.filter((js) =>
                js.history.find((jsHist) => 
                  jsHist.action_key === history_key
                )
              )
            );
          }
        }
      }
      fetchJobSites();
    }
    else if(searchHistoryType && searchHistoryType.includes("User")){
      async function fetchUsers(){
        const users = await getUsers();
        if(users && users.length !== 0){
          setLoadedHistory(users.filter(u => u.history.find(uHist => uHist.history_key === history_key)));
          }
      }
      fetchUsers();
    }
    return () => abortController.abort();
    //check job sites for key
  }, [searchHistoryType]);

  const renderSwitch = () => {
    if (searchHistoryType.includes("Upload") || searchHistoryType.includes("Edit Asset"))
      return <SingleAssetHistoryLog loadedHistory={loadedHistory} />; //assets bulk upload or single upload
    if (searchHistoryType.includes("Job Site"))
      return <SingleJobSiteHistoryLog loadedHistory={loadedHistory} />; //single page history for job site
    if (searchHistoryType.includes("User"))
      return <SingleUserHistoryLog loadedHistory={loadedHistory} /> //single page history for user
  };

  return (
    <div className="single-asset-render">
      <h1>Log Details</h1>
      {loadedHistory &&
        loadedHistory.length !== 0 &&
        searchHistoryType &&
        renderSwitch()}
    </div>
  );
}

export default SingleHistory;

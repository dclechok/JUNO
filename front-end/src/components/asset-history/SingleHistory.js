import "./SingleHistory.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

//utils
import { getJobSites } from "../../utils/api";

//components
import SingleAssetHistoryLog from "./SingleAssetHistoryLog"; //render single asset history log
import SingleJobSiteHistoryLog from "./SingleJobSiteHistoryLog";
//import singleassetjobsitelog
//import singleuserjobsitelog

//renders a single viewable historical entry
function SingleHistory({ assetList, searchHistoryType }) {
  const { history_key } = useParams();
  const [loadedHistory, setLoadedHistory] = useState(null);
  const [refreshJobSites, setRefreshJobSites] = useState(true); //used to refresh job sites in useEffect, via
  console.log(searchHistoryType);
  useEffect(() => {
    //load data via history_key
    //check assets for key(s) (assets are already loaded)
    // if (searchHistoryType && (searchHistoryType === "Single Upload" || searchHistoryType === "Bulk Upload")) {
    //   if (assetList && assetList.length !== 0) {
    //     if (assetList.find((asset) => asset.history.action_key === history_key))
    //       setLoadedHistory(
    //         assetList.filter(
    //           (asset) => asset.history.action_key === history_key
    //         )
    //       );
    //   }
    // }
    if (searchHistoryType && searchHistoryType.includes("Job Site")) {
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
            setLoadedHistory(
              jobSites.filter((js) =>
                js.history.filter((jsHist) => {
                  return jsHist.action_key === history_key;
                })
              )
            );
          }
        }
      }
      fetchJobSites();
    }
    //check job sites for key
  }, []);
  console.log(loadedHistory);
  const renderSwitch = () => {
    if (searchHistoryType && loadedHistory && loadedHistory.length !== 0) {
      if (searchHistoryType.includes("Upload"))
        return <SingleAssetHistoryLog loadedHistory={loadedHistory} />; //assets bulk upload or single upload
      if (searchHistoryType.includes("Job Site"))
        return <SingleJobSiteHistoryLog loadedHistory={loadedHistory} />; //delete or create job site
    }
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

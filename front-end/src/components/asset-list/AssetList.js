import "./AssetList.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//components
import NavGuide from "../navigation/NavGuide.js";
import AssetTracker from "./AssetTracker.js";
import NotificationCenter from "../notification-center/NotificationCenter.js";
import Search from "../navigation/Search.js";
import LoaderSpinner from "../LoaderSpinner";

//utils
import dateFormatter from "../../utils/dateFormatter";
import { getJobSites } from "../../utils/api";
import { getAllAssets } from "../../utils/api";
import sortList from "../../utils/sortList";
import renderLocation from "../../utils/renderLocation";
import listPages from "../../utils/listPages";

//images
import scrollLeft from "../../images/scroll-left-icon.png";
import scrollRight from "../../images/scroll-right-icon.png";

function AssetList({
  assetList,
  setAssetList,
  setFilteredAssetList,
  filteredAssetList,
  navKey,
  setNavKey,
  formattedKey,
  setFormattedKey,
  setLoadAssets,
  loadAssets,
  assetListValues,
}) {
  const [jobSites, setJobSites] = useState();
  const [sortBy, setSortBy] = useState("asset_id"); //default sort list by JUNO id
  const [toggleSortReload, setToggleSortReload] = useState(false);
  const navigate = useNavigate();
  const [pageNum, setPageNum] = useState(1);
  const defaultAssetsPerPage = 500;
  const [assetsPerPage, setAssetsPerPage] = useState(defaultAssetsPerPage);

  // if(assetList) window.location.reload(false);

  useEffect(() => {
    //get list of all assets
    const abortController = new AbortController();
    async function getAssets() {
      setAssetList(await getAllAssets()); //this list will hold the entire list of asset data and will not be modified
      setFilteredAssetList(await getAllAssets());
    }
    getAssets();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    //get list of all job sites
    const abortController = new AbortController();
    async function getJobs() {
      setJobSites(await getJobSites());
    }
    getJobs();
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    //navKey is the properties we're looking for in the device
    if (navKey.site !== "All Assets") {
      //if not World Wide assets, then we must filter
      function filterAssetList() {
        assetList &&
          assetList.length !== 0 &&
          setFilteredAssetList(
            assetList
              .filter( //filter by actual site (type)
                (correctSite) => {
                  //filter by status or filter by job site
                  if(navKey.site === "All Production") return !!correctSite.location.site_loc;
                  if(navKey.site === "All Repairs") return correctSite.status === "Repair";
                  if(navKey.site === "All Storage") return correctSite.status === "Storage";
                  if(navKey.site === "All Transfer") return correctSite.status === "Pending Transfer";
                  return navKey.site === correctSite.location.site;
                }
              )
              .filter((asset) => { //once filtered to site, if
                try {
                  if (asset.location.site_loc === "") //if no IP address is set
                    return asset; 
                  else if (asset.location.site_loc) {
                    //not in storage, repair or retired if it has site number 10 then its deployed?
                    if (navKey.mdc === "00") return asset;
                    else {
                      if (asset.location.site_loc.mdc === navKey.mdc) {
                        if (navKey.shelf === "00") return asset;
                        else {
                          if (asset.location.site_loc.shelf === navKey.shelf) {
                            if (navKey.unit === "00") return asset;
                            else {
                              if (asset.location.site_loc.unit === navKey.unit) {
                                return asset;
                              }
                            }
                          }
                        }
                      } //if real assets mdc does not match - then do not return this asset
                    }
                  }
                } catch (e) {
                  console.log(e, "Filtering asset list by navKey failed.");
                }
                // return Error("Filtering asset failed."); //if all else fails - fix warning?
              })
              .sort((a, b) => sortList(a, b, sortBy)) //sort this filter by whatever button is clicked
          );
      }
      filterAssetList();
    } else if (assetList && assetList.length !== 0)
      setFilteredAssetList(assetList.sort((a, b) => sortList(a, b, sortBy))); //set list back to default full list
    setSortBy("asset_id");
    return () => abortController.abort();
  }, [
    navKey,
    toggleSortReload,
    setFilteredAssetList,
    setAssetsPerPage,
    assetsPerPage, 
    setNavKey, 
    setFormattedKey,
    formattedKey, loadAssets, setLoadAssets
  ]);

  useEffect(() => { //flip back to page one if adjusting results per page
    setPageNum(1);
  }, [assetsPerPage, setAssetsPerPage]);

  const handleSubmitSingleAsset = (e) => {
    const { value } = e.currentTarget;
    navigate(`/${value}`); //load single assest page
  };

  const sortButtonSubmit = (e) => {
    //set sortBy - site, hr, make, model, etc
    setSortBy(e.currentTarget.id);
    setToggleSortReload(!toggleSortReload);
  };

  const handleSelect = (e) => {
    const { value } = e.currentTarget;
    setPageNum(value);
  };
  const handleScroll = (e) => {
    const { id } = e.currentTarget;
    if(id === 'scroll-left' && pageNum >= 2 ) setPageNum(Number(pageNum) - 1);
    if(id === 'scroll-right' && pageNum <= Math.ceil((filteredAssetList.length / assetsPerPage) - 1)) setPageNum(Number(pageNum) + 1);
  };

  const changeResultsPerPage = (e) => {
    if(e.currentTarget.id === "reset-results-per") setAssetsPerPage(defaultAssetsPerPage);
    if(e.currentTarget.value >= 1 && e.currentTarget.value <= defaultAssetsPerPage) setAssetsPerPage(e.currentTarget.value);
  };
  
  return (
    <section>
      {assetList && assetList.length !== 0 && filteredAssetList ? (
        <>
          {/* <div className="inline-tracker-notifications">
           <NotificationCenter />
          </div> */}
          <div className="search-guide-list">
            <div className="center-search-guide">
              <Search
                assetList={assetList}
                setFilteredAssetList={setFilteredAssetList}
              />
              <NavGuide
                navKey={navKey}
                setNavKey={setNavKey}
                formattedKey={formattedKey}
                setFormattedKey={setFormattedKey}
                setLoadAssets={setLoadAssets}
                loadAssets={loadAssets}
                filteredAssetList={filteredAssetList} //so we update Viewing when filtered asset list is rendered
                jobSites={jobSites} //to populate our nav guide's job sites]
                assetList={assetList}
              />
            </div>
            <div>
            <div className="page-nav-inline">
              
            <div><input type="text" id="results-per-page" value={assetsPerPage} onChange={changeResultsPerPage} /><label htmlFor="results-per-page"> Results Per Page</label>&nbsp;<span style={{color: "black"}}>[<button className="button-link" onClick={changeResultsPerPage} id="reset-results-per">Reset</button>]</span></div>
              <div className="pages">
                <button className="image-button" id="scroll-left" onClick={handleScroll}><img src={scrollLeft} /></button>
                {filteredAssetList &&
                <select className="page-numbers" value={pageNum} onChange={handleSelect}>
                  {Array.from(Array(Math.ceil(filteredAssetList.length / assetsPerPage))).map((page, key) => {
                    return <option key={key + 1}>{key + 1}</option>
                  })}
                </select>}
                <p className="page-num-p">
                  /{Math.ceil(filteredAssetList.length / assetsPerPage)}
                </p>
                <button className="image-button" id="scroll-right" onClick={handleScroll}><img src={scrollRight} /></button>
                </div>
              </div>
              <div className="table-height-fixed">
              <table className="table-dark">
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
                  </tr>
                  {filteredAssetList && listPages(filteredAssetList, pageNum, assetsPerPage) &&
                    listPages(filteredAssetList, pageNum, assetsPerPage).map(
                      (asset, index) =>
                        filteredAssetList.length !== 0 &&
                        asset && (
                          <tr key={index}>
                            <td>
                              <button
                                className="asset-tag-button"
                                id="asset-tag"
                                value={asset.asset_id}
                                onClick={handleSubmitSingleAsset}
                              >
                                {asset.asset_tag}
                              </button>
                            </td>
                            <td>{asset.location.site}</td>
                            <td>
                              {asset.location.site_loc === ""
                                ? "Needs Verified"
                                : renderLocation(asset)}
                            </td>
                            <td>{asset.serial_number}</td>
                            <td>{asset.make}</td>
                            <td>{asset.model}</td>
                            <td>{asset.hr}</td>
                            <td>{asset.status}</td>
                            <td>{dateFormatter(asset.updated_at)}</td>
                          </tr>
                        ) //load asset component here
                    )}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="loading">
          <LoaderSpinner message="Mawson Assets"/>
        </div>
      )}
    </section>
  );
}

export default AssetList;

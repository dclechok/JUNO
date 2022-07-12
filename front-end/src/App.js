import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//components
import Nav from "./components/navigation/Nav.js";
import AssetList from "./components/asset-list/AssetList.js";
import SingleAsset from "./components/asset-list/single-asset/SingleAsset.js";
import UploadAssets from "./components/upload-assets/UploadAssets";
import Footer from "./Footer.js";
import LoaderSpinner from "./components/LoaderSpinner.js";

//utils
import calculateValues from "./utils/calculateValues";
import { getAllAssets } from "./utils/api";
import HistoryList from "./components/asset-history/HistoryList";

function App() {
  const [loadAssets, setLoadAssets] = useState(false);
  const [loadSingleAsset, setLoadSingleAsset] = useState(""); //toggle to load single page, or load main list (read/list)
  const [assetList, setAssetList] = useState(""); //holds the loaded list of assets in state
  const [filteredAssetList, setFilteredAssetList] = useState(assetList);
  const [assetListValues, setAssetListValues] = useState({});
  const [navKey, setNavKey] = useState({
    site: "00",
    mdc: "00",
    shelf: "00",
    unit: "00",
  });
  const [formattedKey, setFormattedKey] = useState(""); //for formatting for 'viewing' the navKey
  const [resetDatePicker, setResetDatePicker] = useState(false); //to reset History Search via History List

  useEffect(() => {
    //analyze assetList data and build anaylitics object
    const abortController = new AbortController();
    if (filteredAssetList) {
      setAssetListValues(calculateValues(filteredAssetList));
    }
    return () => abortController.abort();
  }, [assetList, filteredAssetList, setFilteredAssetList]);

  useEffect(() => {
    //get list of all assets
    async function getAssets() {
      setAssetList(await getAllAssets()); //this list will hold the entire list of asset data and will not be modified
      setFilteredAssetList(await getAllAssets());
    }
    getAssets();
  }, []);

  return (
    <div className="App">
      
      <Router>
      <Nav setLoadAssets={setLoadAssets} loadAssets={loadAssets} />

            <Routes>
              <Route
                exact
                path="/"
                element={
                  <AssetList
                    assetList={assetList}
                    setAssetList={setAssetList}
                    filteredAssetList={filteredAssetList}
                    setFilteredAssetList={setFilteredAssetList}
                    navKey={navKey}
                    setNavKey={setNavKey}
                    formattedKey={formattedKey}
                    setFormattedKey={setFormattedKey}
                    setLoadAssets={setLoadAssets} //for toggling loading/filtering of assets
                    loadAssets={loadAssets}
                    assetListValues={assetListValues}
                    loadSingleAsset={loadSingleAsset} //for rendering single asset component
                    setLoadSingleAsset={setLoadSingleAsset}
                  />
                }
              ></Route>
              <Route exact path="/:asset_tag" element={<SingleAsset loadAssets={loadAssets} setLoadAssets={setLoadAssets} assetList={assetList} />}></Route>
              <Route
                exact
                path="/import-assets"
                element={
                  <UploadAssets
                    assetList={assetList}
                    setLoadAssets={setLoadAssets}
                    loadAssets={loadAssets}
                  />
                }
              ></Route>
              <Route exact path="/history" element={<HistoryList resetDatePicker={resetDatePicker} setResetDatePicker={setResetDatePicker} />}></Route>
            </Routes>
            
      </Router>
      <Footer />
    </div>
  );
}

export default App;

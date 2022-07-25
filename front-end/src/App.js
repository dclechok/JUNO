import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
//components
import Login from "./components/login-page/Login";
import LoginBar from "./components/login-page/LoginBar";
import Nav from "./components/navigation/Nav.js";
import AssetList from "./components/asset-list/AssetList.js";
import SingleAsset from "./components/asset-list/single-asset/SingleAsset.js";
import UploadAssets from "./components/upload-assets/UploadAssets";
import AdminPanel from "./components/admin-panel/manage-job-sites/AdminPanel";
import HistoryList from "./components/asset-history/HistoryList";
import SingleHistory from "./components/asset-history/SingleHistory.js";
import Footer from "./Footer.js";

//utils
import calculateValues from "./utils/calculateValues";
import { getAllAssets } from "./utils/api";

function App() {
  const [accountLogged, setAccountLogged] = useState({
    logged: false,
    account: {},
  });
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
  const [searchHistoryType, setSearchHistoryType] = useState(null); //search individual history by this

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

  useEffect(() => {
    setAccountLogged(JSON.parse(localStorage.getItem("acctLogged")));
  }, []);

  return (
    <div className="App">
      {accountLogged && accountLogged.logged ? (
        <Router>
          <Nav setLoadAssets={setLoadAssets} loadAssets={loadAssets} accountLogged={accountLogged} />
          <LoginBar
              accountLogged={accountLogged}
              setAccountLogged={setAccountLogged}
            />
          <Routes>

            <Route
              exact
              path="/"
              element={
                <AssetList
                  accountLogged={accountLogged}
                  setAccountLogged={setAccountLogged}
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
            <Route
              exact
              path="/:asset_id"
              element={
                <SingleAsset
                  loadAssets={loadAssets}
                  setLoadAssets={setLoadAssets}
                  assetList={assetList}
                />
              }
            ></Route>
            <Route
              exact
              path="/import-assets"
              element={
                <UploadAssets
                  assetList={assetList}
                  setLoadAssets={setLoadAssets}
                  loadAssets={loadAssets}
                  accountLogged={accountLogged}
                />
              }
            ></Route>
            <Route
              exact
              path="/admin-panel"
              element={<AdminPanel accountLogged={accountLogged} />}
            ></Route>
            <Route
              exact
              path="/history"
              element={
                <HistoryList
                  resetDatePicker={resetDatePicker}
                  setResetDatePicker={setResetDatePicker}
                  setSearchHistoryType={setSearchHistoryType}
                />
              }
            ></Route>
            <Route
              exact
              path="/history/:history_key"
              element={
                <SingleHistory
                  assetList={assetList}
                  searchHistoryType={searchHistoryType}
                />
              }
            ></Route>
          </Routes>
        </Router>
      ) : (
        <Login
          accountLogged={accountLogged}
          setAccountLogged={setAccountLogged}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;

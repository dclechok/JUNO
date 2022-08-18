import "./Search.css";
import { useState } from "react";

function Search({ assetList, setFilteredAssetList }) {
  const [searchTag, setSearchTag] = useState("");
  const [searchProp, setSearchProp] = useState("ip"); //default selected option by "ip"

  function searchAssetList() {
    //search by IP
    if (searchProp === "ip") {
      const parsedSearchTag = {
        first_octet: searchTag.split(".")[0],
        mdc: searchTag.split(".")[1],
        shelf: searchTag.split(".")[2],
        unit: searchTag.split(".")[3],
      };
      const result = assetList.filter((asset) => {
        if (
            asset.location.site_loc.first_octet === parsedSearchTag.first_octet &&
            asset.location.site_loc.mdc === parsedSearchTag.mdc &&
            asset.location.site_loc.shelf === parsedSearchTag.shelf &&
            asset.location.site_loc.unit === parsedSearchTag.unit
          )
            return asset;
        });
        if (result.length === 0) window.alert(`Sorry, IP not found!`);
        else setFilteredAssetList(result);
        //LOAD ASSET BY IP
    }else{ //search by asset_tag, serial_num, make, model, status
      if (
        assetList.find(
          (asset) => {
            if(asset[searchProp]) return asset[searchProp].toLowerCase() === searchTag.toLowerCase() //asset property must not be null. ie. invoice_num
          }
        )
      ) {
        //SET NAV KEY
        setFilteredAssetList(
          assetList.filter(
            (asset) => asset[searchProp].toLowerCase() === searchTag.toLowerCase()
          )
        ); //LOAD ASSET BY ASSET TAG
      } else {
        window.alert(`Sorry, we can not find the current asset using this search method!`);
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault(); //stop page from reload
    //validate input so that not blank
    //clear space with regex
    if(searchTag.includes(' ')) window.alert("Search field cannot contain spaces!");
    else if(searchTag.length < 1) window.alert("Search field cannot be blank!");
    else searchAssetList();
  };
  
  const handleChange = (e) => {
    if(e.currentTarget.id === "search") setSearchTag(e.currentTarget.value);
    else setSearchProp(e.currentTarget.value);
  };

  const handleClearSearch = (e) => {
    e.preventDefault();
    if(e.currentTarget.id === "reset"){
      setFilteredAssetList(assetList);
      setSearchTag('');
      setSearchProp('ip');
    }
};

  return (
    <div className="search-container">
      <form id="search-form" onSubmit={handleSubmit}>
        <input
          id="search"
          name="search"
          type="text"
          value={searchTag}
          onChange={handleChange}
        />
        <select onChange={handleChange} value={searchProp} > 
          <option id="ip" value="ip" default>IP</option>
          <option id="assetTag" value="asset_tag">Asset Tag</option>
          <option id="serialNum" value="serial_number">Serial #</option>
          <option id="invoiceNum" value="invoice_num">Invoice #</option>
          <option id="make" value="make">Make</option>
          <option id="model" value="model">Model</option>
        </select>
        <div>
        <button
          type="submit"
          className="search-btn"
          value="Submit"
          form="search-form"
        >
          Search
        </button>
        <button
          type="submit"
          className="search-btn"
          id="reset"
          form="search-form"
          onClick={handleClearSearch}
        >
          Clear
        </button>
        </div>
      </form>
    </div>
  );
}

export default Search;

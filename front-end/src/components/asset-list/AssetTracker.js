import "./AssetTracker.css";
import PieChartBuilder from "./PieChartBuilder";

function AssetTracker({ assetListValues, formattedKey}) {
  // assetListValues = {}
  // totalNumOfAssets: 0,
  // numOfHashing: 0,
  // numInStorage: 0,
  // numInRepair: 0,
  // numRetired: 0,


  const machinesDown =
    assetListValues.totalNumOfAssets - assetListValues.numOfHashing;
  return (
      <div className="dashboard-tracker-container">
        <h1>Asset Tracker</h1>
        <h2>Viewing: {formattedKey}</h2>
        <hr />
            <p>Total Machine Count: {assetListValues.totalNumOfAssets}</p>
            <p>
              Total <span style={{ color: "rgb(57, 255, 20)" }}>UP</span>:{" "}
              {assetListValues.numOfHashing} (
              {(
                (assetListValues.numOfHashing /
                  assetListValues.totalNumOfAssets) *
                100
              ).toFixed(2)}
              )%
            </p>
            <p>
              Total <span style={{ color: "rgb(255, 87, 51)" }}>Down</span>:{" "}
              {machinesDown} (
              {`${(
                (machinesDown / assetListValues.totalNumOfAssets) *
                100
              ).toFixed(2)}`}
              %)
            </p>
          {/* make sure data is loaded before we build piechart */}
          {Object.keys(assetListValues).length !== 0 && (<PieChartBuilder assetListValues={assetListValues} />)} 
        </div>
  );
}

export default AssetTracker;

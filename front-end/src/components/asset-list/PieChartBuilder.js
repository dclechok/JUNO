import "./PieChartBuilder.css";

import { RadialChart } from "react-vis";

function PieChartBuilder({ assetListValues }) {
  // assetListValues{ }
  // totalNumOfAssets: 0,
  // numOfHashing: 0,
  // numInStorage: 0,
  // numInRepair: 0,
  // numRetired: 0,
  //TODO : add a new legend
  return (
    <div className="pie-box">
      <div className="pie-container">
        <RadialChart
          data={[
            {
              angle: assetListValues.numOfHashing,
              label: "Hashing",
              // color: "rgb(123, 255, 0)",
            },
            { 
              angle: assetListValues.numInStorage, 
              label: "Storage", 
              // color: "rgb(96, 79, 255)"
            },
            { 
              angle: assetListValues.numInRepair, 
              label: "Repair", 
              // color: "rgb(255, 123, 0)"
            },
            { 
              angle: assetListValues.numRetired, 
              label: "Retired", 
              // color: "rgb(0, 0, 0)"
            },
            { 
              angle: assetListValues.numNeedVerified, 
              label: "Needs Verified", 
              // color: "rgb(0, 0, 0)"
            },
            
          ]}
          label={[ "Hashing", "Storage", "Repair", "Retired"]}
          width={300}
          height={300}
          color={[
            "rgb(10, 228, 39)", //hashing
            "rgb(96, 79, 255)", //storage
            "rgb(255, 123, 0)", //repair
            "rgb(0, 0, 0)", //retired
          ]}
        />
      </div>
    </div>
  );
}

export default PieChartBuilder;

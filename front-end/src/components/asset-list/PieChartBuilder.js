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
        colorType="literal"
          data={[
            {
              angle: assetListValues.numOfHashing,
              label: "Hashing",
              color: "rgb(57, 255, 20)"
            },
            { 
              angle: assetListValues.numInStorage, 
              label: "Storage", 
              color: "rgb(107, 155, 228)"
            },
            { 
              angle: assetListValues.numInRepair, 
              label: "Repair", 
              color: "rgb(255, 123, 0)"
            },
            { 
              angle: assetListValues.numRetired, 
              label: "Retired", 
              color: "rgb(0, 0, 0)"
            },
            { 
              angle: assetListValues.numNeedVerified, 
              label: "Needs Verified", 
              color: "rgb(255, 87, 51)"
            },
            {
              angle: assetListValues.numInTransfer,
              label: "Pending Transfer",
              color: "rgb(133, 109, 200)"
            }
          ]}
          width={300}
          height={300}
          // showLabels={true}
        />
      </div>
    </div>
  );
}

export default PieChartBuilder;

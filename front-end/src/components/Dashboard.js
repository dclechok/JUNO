import './Dashboard.css';

import PieChartBuilder from './asset-list/PieChartBuilder';

//utils
import colorCode from '../utils/colorCodes';

function Dashboard({ assetListValues }) {
    /*
    numInRepair: 0
numInStorage: 0
numInTransfer: 0
numNeedVerified: 0
numOfHashing: 132
numRetired: 0
totalNumOfAssets: 132
    */
   console.log(assetListValues.totalNumOfAssets)
    return (
        <div>
            <PieChartBuilder assetListValues={assetListValues} />
            <div className='pie-chart-legend'>
                <p><span style={{color: colorCode['Hashing']}}>Hashing</span>: {assetListValues.numOfHashing} ({((assetListValues.numOfHashing / assetListValues.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                <p><span style={{color: colorCode['Storage']}}>Storage</span>: {assetListValues.numInStorage} ({((assetListValues.numInStorage / assetListValues.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                <p><span style={{color: colorCode['Pending Transfer']}}>Pending Transfer</span>: {assetListValues.numInTrasfer} ({((assetListValues.numInTransfer / assetListValues.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                <p><span style={{color: colorCode['Repair']}}>Repair</span>: {assetListValues.numInRepair} ({((assetListValues.numInRepair / assetListValues.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                <p><span style={{color: colorCode['Retired']}}>Retired</span>: {assetListValues.numRetired} ({((assetListValues.numRetired / assetListValues.totalNumOfAssets) * 100).toFixed(2)}%)</p>

            </div>
            <div>
            <h1>Total Global Assets: {assetListValues.totalNumOfAssets}</h1>
            <h1>Total Assets Hashing: {assetListValues.numOfHashing}</h1>
            <h1>Total Assets Down: {assetListValues.totalNumOfAssets - assetListValues.numOfHashing}</h1>
            </div>
        </div>
    )
}

export default Dashboard;
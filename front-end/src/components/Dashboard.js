import './Dashboard.css';

import PieChartBuilder from './asset-list/PieChartBuilder';
import { useEffect, useState } from 'react';
//utils
import colorCode from '../utils/colorCodes';
import calculateValues from '../utils/calculateValues';
import LoaderSpinner from './LoaderSpinner';

function Dashboard({ assetList }) {
    const [calcListVal, setCalcListVal] = useState();
    /*
    numInRepair: 0
numInStorage: 0
numInTransfer: 0
numNeedVerified: 0
numOfHashing: 132
numRetired: 0
totalNumOfAssets: 132
    */
    useEffect(() => {
        if(assetList.length !== 0) setCalcListVal(calculateValues(assetList));
    }, []);

    return (<>
        {calcListVal ? 
        <div>
            <PieChartBuilder assetListValues={calcListVal} />
            <div className='pie-chart-legend'>
                <p><span style={{color: colorCode['Hashing']}}>Hashing</span>: {calcListVal.numOfHashing} ({((calcListVal.numOfHashing / calcListVal.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                <p><span style={{color: colorCode['Storage']}}>Storage</span>: {calcListVal.numInStorage} ({((calcListVal.numInStorage / calcListVal.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                <p><span style={{color: colorCode['Pending Transfer']}}>Pending Transfer</span>: {calcListVal.numInTrasfer} ({((calcListVal.numInTransfer / calcListVal.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                <p><span style={{color: colorCode['Repair']}}>Repair</span>: {calcListVal.numInRepair} ({((calcListVal.numInRepair / calcListVal.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                <p><span style={{color: colorCode['Retired']}}>Retired</span>: {calcListVal.numRetired} ({((calcListVal.numRetired / calcListVal.totalNumOfAssets) * 100).toFixed(2)}%)</p>

            </div>
            <div>
            <h1>Total Global Assets: {calcListVal.totalNumOfAssets}</h1>
            <h1>Total Assets Hashing: {calcListVal.numOfHashing}</h1>
            <h1>Total Assets Down: {calcListVal.totalNumOfAssets - calcListVal.numOfHashing}</h1>
            </div>
        </div> : <LoaderSpinner />}</>
    )
}

export default Dashboard;
import './Dashboard.css';

import PieChartBuilder from './asset-list/PieChartBuilder';
import { useEffect, useState } from 'react';
//utils
import colorCode from '../utils/colorCodes';
import calculateValues from '../utils/calculateValues';
import LoaderSpinner from './LoaderSpinner';
//components
import { getAllAssets } from '../utils/api';

function Dashboard() {
    const [calcListVal, setCalcListVal] = useState();
    const [assetList, setAssetList] = useState();
    /*
    numInRepair: 0
numInStorage: 0
numInTransfer: 0
numNeedVerified: 0
numOfHashing: 132
numRetired: 0
totalNumOfAssets: 132
numSold ???
    */

    useEffect(() => {
        const abortController = new AbortController();
        if (!assetList) {
            async function getAssets() {
                setAssetList(await getAllAssets());
            }
            getAssets();
        }
        return () => abortController.abort();
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        if (assetList && assetList.length !== 0) setCalcListVal(calculateValues(assetList));
        return () => abortController.abort();
    }, [assetList, setAssetList]);

    return (<>
        {calcListVal ?
            <div className='stat-container'>
                <div className='pie-chart-legend'>
                    <p><span style={{ color: colorCode['Hashing']}}>Hashing</span>: {calcListVal.numOfHashing} ({((calcListVal.numOfHashing / calcListVal.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                    <p><span style={{ color: colorCode['Storage']}}>Storage</span>: {calcListVal.numInStorage} ({((calcListVal.numInStorage / calcListVal.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                    <p><span style={{ color: colorCode['Pending Transfer']}}>Pending Transfer</span>: {calcListVal.numInTransfer} ({((calcListVal.numInTransfer / calcListVal.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                    <p><span style={{ color: colorCode['Repair']}}>Repair</span>: {calcListVal.numInRepair} ({((calcListVal.numInRepair / calcListVal.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                    <p><span style={{ color: colorCode['Retired']}}>Retired</span>: {calcListVal.numRetired} ({((calcListVal.numRetired / calcListVal.totalNumOfAssets) * 100).toFixed(2)}%)</p>
                    <p><span style={{ color: colorCode['Sold']}}>Sold</span>:</p>
                </div>
                <div className='stat-text'>
                    <h1>Total Global Assets: <b>{calcListVal.totalNumOfAssets}</b></h1>
                    <h1>Total Assets Hashing: <b>{calcListVal.numOfHashing}</b></h1>
                    <h1>Total Assets Down: <b>{calcListVal.totalNumOfAssets - calcListVal.numOfHashing}</b></h1>
                </div>
                <PieChartBuilder assetListValues={calcListVal} />


            </div> : <LoaderSpinner />}</>
    )
}

export default Dashboard;
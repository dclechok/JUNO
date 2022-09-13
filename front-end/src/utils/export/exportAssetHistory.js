//this function will handle all the exporting to CSV for assetList
import Papa from "papaparse";
import renderLocation from "../renderLocation";
import dateFormatter from '../dateFormatter';

const fileDownload = require('js-file-download');

function exportAssetHistory(assets, currentHistoryLog){
    console.log(currentHistoryLog)
    const csv = Papa.unparse({
        fields: [ //headers
            "Site (Location)",
            "MDC", 
            "Asset Tag",
            "Serial Number",
            "Make (Vendor)",
            "Model",
            "Hash Rate",
            "Verified Date (Turn on Date)", // mm/dd/yyyy
            "Logged By"
            ], 
            data: assets.map(asset => {
                return [
                    asset.location.site || '', // ex. "Midland, PA"
                    renderLocation(asset) || '', // IP if applicable
                    asset.asset_tag || '', // asset tag
                    asset.serial_number || '', // sn
                    asset.make || '', //make
                    asset.model || '', //model
                    asset.hr || '', // hash rate
                    dateFormatter(JSON.parse(currentHistoryLog.action_date)), //verified date - turned on/created on JUNO
                    currentHistoryLog.action_by
                ];
            })
        });
        const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
        fileDownload(blob, `Asset Upload-${dateFormatter(JSON.parse(currentHistoryLog.action_date))}-by ${currentHistoryLog.action_by}.csv`)
}

export default exportAssetHistory;
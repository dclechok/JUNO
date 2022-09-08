//this function will handle all the exporting to CSV for assetList
import Papa from "papaparse";
import renderLocation from "./renderLocation";
import dateFormatter from './dateFormatter';

const fileDownload = require('js-file-download');

function exportCsv(filteredAssetList){
    console.log(filteredAssetList)
    const csv = Papa.unparse({
        fields: [ //headers
            "Site (Location)",
            "MDC", 
            "Asset Tag",
            "Serial Number",
            "Make (Vendor)",
            "Model",
            "Hash Rate",
            "Invoice Number",
            "Received Date", // mm/dd/yyyy
            "Verified Date (Turn on Date)", // mm/dd/yyyy
            "Current Value",
            "Deactivation Date"
            ], 
            data: filteredAssetList.map(asset => {
                return [
                    asset.location.site || '', // ex. "Midland, PA"
                    renderLocation(asset) || '', // IP if applicable
                    asset.asset_tag || '', // asset tag
                    asset.serial_number || '', // sn
                    asset.make || '', //make
                    asset.model || '', //model
                    asset.hr || '', // hash rate
                    asset.invoice_num || '', //invoice num if applicable
                    "Received Date", //mm/dd/yyyy
                    dateFormatter(asset.created_at), //verified date - turned on/created on JUNO
                    "Current Value",
                    asset.EOL_date || ''
                ];
            })
        });
        console.log(csv);
        const blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
        const newDate = new Date();
        fileDownload(blob, `${dateFormatter()}.csv`)

}

export default exportCsv;
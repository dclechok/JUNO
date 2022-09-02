//front end validation for location data
        // -> asset can't move to a spot that is already filled (not including itself)
        // -> must be within range of site's set ranges
        // -> asset much be two digits (string of number digits only) or we concat a 0

const _ = require('lodash'); //for comparing objects

function validateLoc(currentLoc, singleAsset, assetList){
    
    //make sure all values in currentLoc are two digits (and numbers only)
    let newIP = {}; //build and validate newIP (if we need to concat an 0 on a single digit entry)
    console.log(currentLoc, 'test');
    if(currentLoc.site === '' || currentLoc.site === undefined || currentLoc.site === '-- Select Site --') return "A destination job site must be selected!";

    for(let locData in currentLoc.site_loc){
        //no fields can be blank
        if(currentLoc.site_loc[locData] === '' || currentLoc.site_loc[locData] === undefined) return "IP data field(s) cannot be empty!";
        //char can only be a number
        if(currentLoc.site_loc[locData].split().find(char => char.charCodeAt() < 48 || char.charCodeAt() > 57)) return "IP data must consist of numbers only! (Up to two digits)";
        //construct new IP octet if user only entered one digit (ex. "3" becomes "03")
        if(currentLoc.site_loc[locData].length === 1) newIP[locData] = '0'.concat(currentLoc.site_loc[locData]);
        else newIP[locData] = currentLoc.site_loc[locData];
        //"00" is an invalid entry
        if(newIP[locData] === "00") return `The entry for ${locData} must not be less than "01"!`;
    }

    //TODO: check for range

    //set our validated location data, now lets check if another device is in the slot
    const newLocObject = {...currentLoc, ["site_loc"]: { ...newIP }};
    //compare site name, and site_loc (ip)
    const existingSlot = assetList.find(asset => asset.location.site === newLocObject.site && _.isEqual(asset.location.site_loc, newLocObject.site_loc));
    //we are trying to move the object to the same position it is in?
    if(existingSlot && existingSlot.asset_id === singleAsset.asset_id) return "This device is already slotted in this location!";
    //we are trying to move the object to a filled slot that is not this current singleAsset device
    if(existingSlot && existingSlot.asset_id !== singleAsset.asset_id) return "There is already a device slotted in that location!";
    
    //if all else passes, return our newly validated and checked location object
    return newLocObject;

}

export default validateLoc;
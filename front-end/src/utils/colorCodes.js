const colorCode = {
    //history log actions
    'Bulk Upload': 'rgb(110, 236, 236)', 
    'Single Upload': 'rgb(110, 190, 236)',
    'Move Asset': 'rgb(66, 90, 229)',
    'Edit Asset': 'rgb(205, 214, 126)',
    'Create Job Site': 'rgb(205, 129, 224)',
    'Deactivate Job Site': 'rgb(176,196,222)',
    'Edit Job Site': 'rgb(76,250,77)',
    'Create User': 'rgb(166,103,217)',
    'Update User': 'rgb(140, 20, 220)',
    'Deactivate User': 'rgb(234, 80, 23)',
    'Edit User': 'rgb(218,238,156)',
    //active vs non active status
    "Active": "rgb(107, 155, 228)",
    "Non-Active": "rgb(170, 175, 191)",
    //pie chart and legend coloring
    'Hashing': "rgb(57, 255, 20)",
    'Storage': "rgb(107, 155, 228)",
    'Repair': "rgb(255, 123, 0)",
    "Retired": "rgb(32, 120, 99)",
    "Pending Transfer": "rgb(133, 109, 200)"

  };
  
  export default colorCode;

  /*
  \
  
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
  
  
  */
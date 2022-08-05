//builds an object that holds page number, and assets per page

function listPages( filteredAssetList, pageNum, assetsPerPage ){ //and page number?
    const TOTAL_RESULTS_PER_PAGE = Number(assetsPerPage);

    console.log(assetsPerPage, pageNum)
    let buildPages = {};
    let pageCounter = 1; //start on page 1
    filteredAssetList.forEach(asset => {
            if(!buildPages[pageCounter]) buildPages[pageCounter] = [asset];
            else buildPages[pageCounter].push(asset);
            if(Object.entries(buildPages[pageCounter]).length === TOTAL_RESULTS_PER_PAGE) pageCounter++; //
    });
    //return an array, using pageNum from
    
    return buildPages[pageNum];
}

export default listPages;
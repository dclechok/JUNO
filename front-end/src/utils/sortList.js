//sort by site, make, model, hash rate, status, updated_at
// todo: implement a reverse sort?

function sortList(a, b, sortBy) {
  if (a && b) {
    try {
      if (sortBy !== "site") {
        return a[sortBy].toString().localeCompare(b[sortBy].toString());
      } else return a.location[sortBy].toString().localeCompare(b.location[sortBy].toString());
    } catch (e) {
      console.log(e, "Sorting failed.");
    }
  }
}

export default sortList;

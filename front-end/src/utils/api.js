import generateHistoryKey from "./generateHistoryKey";
import createHistory from "./createHistory";

const BASE_URL = "http://localhost:5000/";

export async function handleLoginPassCheck(pass, user) {
  try {
    const response = await fetch(BASE_URL + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { unhashed: pass, user: user } })
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to fetch all assets.");
  }
}
// ASSETS - GET ALL //
export async function getAllAssets() {
  try {
    const response = await fetch(BASE_URL + "assets", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) {
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to fetch all assets.");
  }
}
// ASSETS - CREATE ONE //
export async function createAsset(assets) {
  try {
    const response = await fetch(BASE_URL + "assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: assets }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse && !jsonResponse.error) {
      //if POST request was successful, create a log 
      //eventually add comments, and "approved_by"?
      const awaitCreateHistory = await createHistory(jsonResponse);
      if (!awaitCreateHistory)
        throw new Error("Making request for history log failed!");
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to post assets.");
  }
}
// ASSETS - READ ONE //
export async function getSingleAsset(asset_id) {
  try {
    const response = await fetch(BASE_URL + `assets/${asset_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to fetch all assets.");
  }
}

// ASSETS - UPDATE //
export async function updateAsset(asset_id, data) {
  try {
    const response = await fetch(BASE_URL + `assets/${asset_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: data })
    });
    const jsonResponse = await response.json();
    if (jsonResponse && !jsonResponse.error) { //if update request is successful, make a request to create new history log
      //eventually add comments, and "approved_by";
      const awaitCreateHistory = await createHistory(jsonResponse);
      if (!awaitCreateHistory)
        throw new Error("Making request for history log failed!");
    }
    return jsonResponse;
  } catch (e) {
    console.log(e, 'Failed to update asset.');
  }
}

// ASSETS - DELETE ONE //
export async function deleteAsset(asset_id) {
  try {
    const response = await fetch(BASE_URL + `assets/${asset_id}`, {
      method: "DELETE",
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to fetch all assets.");
  }
}

/*----------------------*/

// JOB SITES - GET ALL //
export async function getJobSites() {
  try {
    const response = await fetch(BASE_URL + "physical_sites", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to fetch all job sites.");
  }
}

export async function getJobSite(jobSiteID) {
  try {
    const response = await fetch(BASE_URL + `physical_sites/${jobSiteID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to fetch all job sites.");
  }
}

// JOB SITES - CREATE ONE //
export async function createJobSite(jobSite) {
  // console.log(jobSite);
  try {
    const response = await fetch(BASE_URL + "physical_sites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: jobSite }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse && !jsonResponse.error) {
      //if POST request was successful, create a log in history_log table
      //eventually add comments, and "approved_by";
      const awaitCreateHistory = await createHistory(jsonResponse);
      if (!awaitCreateHistory)
        throw new Error("Making request for history log failed!");
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to post job site.");
  }
}

export async function updateJobSite(newSiteData, accountLogged) {
  try {
    const response = await fetch(BASE_URL + `physical_sites/${newSiteData.physical_site_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: newSiteData,
      }),
    });
    const jsonResponse = await response.json();
    if (jsonResponse && !jsonResponse.error) { //if updating job site was successful, move to create historical entry
      const awaitCreateHistory = await createHistory(jsonResponse);
      if (!awaitCreateHistory)
        throw new Error("Making request for history log failed!");
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to update job site.");
  }
}

//when a job site is deactivated, set all of its asset's status to "pending transfer"
async function setAssetsPendingTransfer(oldJobSite){
  try{
    const response = await fetch(BASE_URL + `assets`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: oldJobSite })
    });
    const jsonResponse = await response.json();
    if(jsonResponse && !jsonResponse.error){
      console.log('Successfully Updated Assets to Pending Transfer!');
    }
  }catch(e){
    console.log('Setting assets status to "Pending Transfer" failed.')
  }
}

// JOB SITES - DEACTIVATE/UPDATE ONE //
export async function deactivateJobSite(id, oldJobSite) {
  //DO NOT ACTUALLY PERMANENTLY DELETE FROM DB
  try {
    const response = await fetch(BASE_URL + `physical_sites/deactivate/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: oldJobSite }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse && !jsonResponse.error) {
      //if POST request was successful, create a log in
      //eventually add comments, and "approved_by";
      const awaitCreateHistory = await createHistory(jsonResponse);
      if (!awaitCreateHistory)
        throw new Error("Making request for history log failed!");
      else setAssetsPendingTransfer(oldJobSite);
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to deactivate all assets.");
  }
}

/*----------------------*/

// HISTORY LOG - GET ALL //
export async function getHistory() {
  //get all history
  try {
    const response = await fetch(BASE_URL + "history_log", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to fetch all history.");
  }
}

//get history by userID
export async function listHistoryByUserID(userID) {
  try {
    const response = await fetch(BASE_URL + `history_log/by-user/${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to fetch all history.");
  }
}

/*----------------------*/

// USERS - GET ALL //
export async function getUsers() {
  try {
    const response = await fetch(BASE_URL + "users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to fetch all users.");
  }
}

export async function getUser(user_id) {
  try {
    const response = await fetch(BASE_URL + `users/${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse.data;
  } catch (e) {
    console.log(e, "Failed to fetch user.");
  }
}

export async function updateUser(newUserData, userID) {
  try {
    const response = await fetch(BASE_URL + `users/${userID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: newUserData }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse && !jsonResponse.error) {
      //if POST request was successful, create a log in
      //eventually add comments, and "approved_by";
      const awaitCreateHistory = await createHistory(jsonResponse);
      if (!awaitCreateHistory)
        throw new Error("Making request to update user failed!");
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to update user.");
  }
}

export async function updatePass(userDetails, newUserDetails) {
  try {
    const response = await fetch(BASE_URL + `users/updatepw/${userDetails.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [newUserDetails, userDetails] }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse && !jsonResponse.error) {
      //if PUT request was successful, create a log in history
      //eventually add comments, and "approved_by";
      const awaitCreateHistory = await createHistory(jsonResponse);
      if (!awaitCreateHistory)
        throw new Error("Making request create user failed!");
    }
    return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to update user.");
  }
}


// USERS - CREATE ONE //
export async function createUser(user) {
  try {
    const response = await fetch(BASE_URL + "users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: user }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse && !jsonResponse.error) {
      //if POST request was successful, create a log in
      //eventually add comments, and "approved_by";
      const awaitCreateHistory = await createHistory(jsonResponse);
      if (!awaitCreateHistory)
        throw new Error("Making request create user failed!");
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to post to users.");
  }
}

// USERS - DEACTIVATE
export async function deactivateUser(prevUserData) {
  //DO NOT ACTUALLY PERMANENTLY DELETE FROM DB

  try {
    const response = await fetch(BASE_URL + `users/deactivate/${prevUserData.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: prevUserData }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse && !jsonResponse.error) {
      //if PUT request was successful, create a log in
      //eventually add comments, and "approved_by";
      const awaitCreateHistory = await createHistory(jsonResponse);
      if (!awaitCreateHistory)
        throw new Error("Making request for history log failed!");
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to deactivate user.");
  }
}
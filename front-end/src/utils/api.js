import generateHistoryKey from "./generateHistoryKey";
import createHistory from "./createHistory";

const BASE_URL = "http://localhost:5000/";

export async function handleLoginPassCheck(pass, user){
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
    if (jsonResponse) 
    {
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
export async function getSingleAsset(asset_id){
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
export async function updateAsset(asset_id, data){
  try{
    const response = await fetch(BASE_URL + `assets/${asset_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: data })
    });
    const jsonResponse = await response.json();
    if(jsonResponse && !jsonResponse.error){ //if update request is successful, make a request to create new history log
    //eventually add comments, and "approved_by";
    const awaitCreateHistory = await createHistory(jsonResponse);
    if (!awaitCreateHistory)
      throw new Error("Making request for history log failed!");
    }
    return jsonResponse;
  }catch(e){
    console.log(e, 'Failed to update asset.');
  }
}

// ASSETS - DELETE ONE //
export async function deleteAsset(asset_id){
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

export async function getJobSite(jobSiteID){
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

export async function updateJobSite(newSiteData, accountLogged){
  const newDate = new Date();
  const newHistoryKey = generateHistoryKey();
  newSiteData.history.push({
    action_taken: "Edit Job Site",
    action_by: accountLogged.account[0].name,
    action_by_id: accountLogged.account[0].user_id,
    action_key: newHistoryKey,
    action_date: newDate,
    action_comment: "Edit Job Site",
  })
  try{
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
    if(jsonResponse){ //if updating job site was successful, move to create historical entry
      const { name, user_id } = accountLogged.account[0];
      const awaitCreateHistory = await createHistory({
        logged_action: "Edit Job Site",
        logged_date: newDate,
        logged_by: name,
        logged_by_id: user_id,
        history_key: newHistoryKey,
      });
      if (!awaitCreateHistory)
        throw new Error("Making request for history log failed!");
      return jsonResponse;
    }
  }catch(e){
    console.log(e, "Failed to update job site.");
  }
}

// JOB SITES - DEACTIVATE/UPDATE ONE //
export async function deactivateJobSite(id, accountLogged, oldJobSiteHistory) {
  //DO NOT ACTUALLY PERMANENTLY DELETE FROM DB
  const newDate = new Date();
  const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")
  oldJobSiteHistory.push({
    //push new entry onto the old job site history list
    action_taken: "Deactivate Job Site",
    action_by: accountLogged.account[0].name,
    action_by_id: accountLogged.account[0].user_id,
    action_key: newHistoryKey,
    action_date: newDate,
    action_comment: "Deactivated Job Site",
  });
  try {
    const response = await fetch(BASE_URL + `physical_sites/deactivate/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          status: "Non-Active",
          history: oldJobSiteHistory,
        },
      }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) {
      //if POST request was successful, create a log in
      //eventually add comments, and "approved_by";
      const { name, user_id } = accountLogged.account[0];
      const awaitCreateHistory = await createHistory({
        logged_action: "Deactivate Job Site",
        logged_date: newDate,
        logged_by: name,
        logged_by_id: user_id,
        history_key: newHistoryKey,
      });
      if (!awaitCreateHistory)
        throw new Error("Making request for history log failed!");
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to fetch all assets.");
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
export async function listHistoryByUserID(userID){
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

export async function getUser(user_id){
  try{
    const response = await fetch(BASE_URL + `users/${user_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse.data;
  }catch(e){
    console.log(e, "Failed to fetch user.");
  }
}

export async function updateUser(newUserData, accountLogged, userID){
  const newDate = new Date();
  const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")
    //push new entry onto the old job site history list
  newUserData.history.push(
    { 
      action_taken: "Edit User",
      action_by: accountLogged.account[0].name,
      action_by_id: accountLogged.account[0].user_id,
      action_key: newHistoryKey,
      action_date: newDate,
      // action_comment: "Edited User Details"
  });
  try {
    const response = await fetch(BASE_URL + `users/${userID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: newUserData }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) {
      //if POST request was successful, create a log in
      //eventually add comments, and "approved_by";
      const { updated_at } = jsonResponse.data;
      const { action_by, action_by_id, history_key } = (jsonResponse.data.history[jsonResponse.data.history.length - 1]);
      const awaitCreateHistory = await createHistory({
        logged_action: "Edit User",
        logged_date: updated_at,
        logged_by: action_by,
        logged_by_id: action_by_id,
        history_key: history_key
      });
      if (!awaitCreateHistory)
        throw new Error("Making request create user failed!");
      return jsonResponse;
    }
  }catch(e){
    console.log(e, "Failed to update user.");
  }
}

export async function updatePass(userDetails, newUserDetails, accountLogged){
  const newDate = new Date();
  const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")
  const user_id = accountLogged.account[0].user_id;
    //push new entry onto the old job site history list
  console.log(accountLogged.account)
  userDetails.history.push(
    { 
      action_taken: "Edit User",
      action_by: accountLogged.account[0].name,
      action_by_id: user_id,
      action_key: newHistoryKey,
      action_date: newDate,
      // action_comment: "Edited User Details"
  });
  try {
    const response = await fetch(BASE_URL + `users/updatepw/${user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: [newUserDetails, userDetails] }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    console.log(jsonResponse);
    if (jsonResponse && !jsonResponse.error) {
      //if POST request was successful, create a log in
      //eventually add comments, and "approved_by";
      const { updated_at } = jsonResponse.data;
      const { action_by, action_by_id, history_key } = (jsonResponse.data.history[jsonResponse.data.history.length - 1]);
      const awaitCreateHistory = await createHistory({
        logged_action: "Edit User",
        logged_date: updated_at,
        logged_by: action_by,
        logged_by_id: action_by_id,
        history_key: history_key
      });
      if (!awaitCreateHistory)
        throw new Error("Making request create user failed!");
    }
    return jsonResponse;
  }catch(e){
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
    if (jsonResponse) {
      //if POST request was successful, create a log in
      //eventually add comments, and "approved_by";
      const { updated_at } = jsonResponse.data;
      const { action_by, action_by_id, history_key } = (jsonResponse.data.history[0]);
      const awaitCreateHistory = await createHistory({
        logged_action: "Create User",
        logged_date: updated_at,
        logged_by: action_by,
        logged_by_id: action_by_id,
        history_key: history_key
      });
      if (!awaitCreateHistory)
        throw new Error("Making request create user failed!");
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to post to users.");
  }
}

// USERS - DEACTIVATE
export async function deactivateUser(prevUserData, accountLogged) {
  //DO NOT ACTUALLY PERMANENTLY DELETE FROM DB
  const newDate = new Date();
  console.log(prevUserData)
  const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")
  prevUserData[0].history.push({
    //push new entry onto the old job site history list
    action_date: newDate,
    action_taken: "Deactivate User",
    action_by: accountLogged.account[0].name,
    action_by_id: accountLogged.account[0].user_id,
    history_key: newHistoryKey,
  });
  try {
    const response = await fetch(BASE_URL + `users/deactivate/${prevUserData[0].user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          status: "Non-Active",
          history: prevUserData[0].history,
        },
      }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) {
      //if POST request was successful, create a log in
      //eventually add comments, and "approved_by";
      const { name, user_id } = accountLogged.account[0];
      const awaitCreateHistory = await createHistory({
        logged_action: "Deactivate User",
        logged_date: newDate,
        logged_by: name,
        logged_by_id: user_id,
        history_key: newHistoryKey,
      });
      if (!awaitCreateHistory)
        throw new Error("Making request for history log failed!");
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to deactivate user.");
  }
}
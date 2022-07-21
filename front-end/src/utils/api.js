import generateHistoryKey from "./generateHistoryKey";

const BASE_URL = "http://localhost:5000/";

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
    if (jsonResponse) return jsonResponse;
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
    if (jsonResponse) {
      //if POST request was successful, create a log in
      const { action_by, action_taken, action_key } = jsonResponse.data.history;
      const { updated_at } = jsonResponse.data;
      //eventually add comments, and "approved_by";
      const awaitCreateHistory = await createHistory({
        logged_action: action_taken,
        logged_date: updated_at,
        logged_by: action_by,
        history_key: action_key,
      });
      if (!awaitCreateHistory)
        throw new Error("Making request for history log failed!");
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to post assets.");
  }
}
// ASSETS - READ ONE //
export async function getSingleAsset(asset_tag) {
  try {
    const response = await fetch(BASE_URL + `assets/${asset_tag}`, {
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
// ASSETS - DELETE ONE //
export async function deleteAsset(asset_tag) {
  try {
    const response = await fetch(BASE_URL + `assets/${asset_tag}`, {
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
// JOB SITES - CREATE ONE //
export async function createJobSite(jobSite) {
  try {
    const response = await fetch(BASE_URL + "physical_sites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: jobSite }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) {
      //if POST request was successful, create a log in history_log table
      const { action_by, action_by_id, action_key, action_taken } =
        jsonResponse.data.history[0];
      const { updated_at } = jsonResponse.data;
      //eventually add comments, and "approved_by";
      const awaitCreateHistory = await createHistory({
        logged_action: action_taken,
        logged_date: updated_at,
        logged_by: action_by,
        logged_by_id: action_by_id,
        history_key: action_key,
      });
      if (!awaitCreateHistory)
        throw new Error("Making request for history log failed!");
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to post job site.");
  }
}

// JOB SITES - DEACTIVATE/UPDATE ONE //
export async function deactivateJobSite(id, accountLogged, oldJobSiteHistory) {
  //DO NOT ACTUALLY PERMANENTLY DELETE FROM DB
  const newDate = new Date();
  const newHistoryKey = generateHistoryKey(); //generate unique history key ("action_key")
  oldJobSiteHistory.push({ //push new entry onto the old job site history list
    action_taken: "Deactivate Job Site",
    action_by: accountLogged.account[0].name,
    action_by_id: accountLogged.account[0].user_id,
    action_key: newHistoryKey,
    action_date: newDate
  });
  try {
    const response = await fetch(BASE_URL + `physical_sites/${id}`, {
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
      console.log(name)
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

// HISTORY LOG - CREATE ONE //
async function createHistory(historyLog) {
  try {
    const response = await fetch(BASE_URL + "history_log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: historyLog }),
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to post history.");
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

    return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to fetch all history.");
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
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to post history.");
  }
}

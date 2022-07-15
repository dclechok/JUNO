const BASE_URL = "http://localhost:5000/";

// FETCH ALL ASSETS TABLE //
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

export async function getSingleAsset(asset_tag){
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

export async function deleteAsset(asset_tag){
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
// FETCH JOB SITES TABLE //
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

export async function createJobSite(jobSite){
  try {
    const response = await fetch(BASE_URL + "physical_sites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: jobSite })
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse){ //if POST request was successful, create a log in
      console.log(jsonResponse);
    }
  } catch (e) {
    console.log(e, "Failed to post job site.");
  }
}

export async function deleteJobSite(id){
  try {
    const response = await fetch(BASE_URL + `physical_sites/${id}`, {
      method: "DELETE",
    });
    const jsonResponse = await response.json(); //json-ify readablestream data;
  } catch (e) {
    console.log(e, "Failed to fetch all assets.");
  }
}

// POST NEW ASSETS // 
export async function createAsset(assets) {
  try {
    const response = await fetch(BASE_URL + "assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: assets })
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse){ //if POST request was successful, create a log in
      const { action_by, action_taken, action_key} = jsonResponse.data.history;
      const { updated_at } = jsonResponse.data;
      //eventually add comments, and "approved_by";
      const awaitCreateHistory = await createHistory({
        logged_action: action_taken,
        logged_date: updated_at, 
        logged_by: action_by,
        history_key: action_key
      });
      if(!awaitCreateHistory) throw new Error("Making request for history log failed!");
      return jsonResponse;
    }
  } catch (e) {
    console.log(e, "Failed to post assets.");
  }
}

// FETCH GENERALIZED LIST OF HISTORY DATA
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

// CREATE A NEW GENERALIZED HISTORY LOG
async function createHistory(historyLog){
  try {
    const response = await fetch(BASE_URL + "history_log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: historyLog })
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to post history.");
  }
}


// USERS
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

export async function createUser(user) {
  try {
    const response = await fetch(BASE_URL + "users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: user })
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to post history.");
  }
}
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
    console.log(e, "Failed to fetch all assets.");
  }
}

// POST NEW ASSETS // 
export async function createAsset(assets) {
  try {
    //remove csv index
    const response = await fetch(BASE_URL + "assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: assets })
    });
    const jsonResponse = await response.json(); //json-ify readablestream data
    if (jsonResponse) return jsonResponse;
  } catch (e) {
    console.log(e, "Failed to fetch post request.");
  }
}

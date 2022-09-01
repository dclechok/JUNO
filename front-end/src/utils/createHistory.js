//utils

const BASE_HISTORY_URL = "http://localhost:5000/history_log";
//create a history log once a request is successfully completed
async function createHistory(successfulRequest){
    const { updated_at } = successfulRequest.data;
    const { action_by, action_by_id, action_taken, action_key, action_comment } =
    successfulRequest.data.history[0];

    const historyLog = {
    logged_action: action_taken, //ie. "Move Asset"
    logged_date: updated_at, 
    logged_by: action_by, //user's name
    logged_by_id: action_by_id, //119
    history_key: action_key, //unique history key that can be searched for
    logged_details: {details: action_comment} //to be changed to details of change
    };

    try {
        const response = await fetch(BASE_HISTORY_URL, {
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

export default createHistory;
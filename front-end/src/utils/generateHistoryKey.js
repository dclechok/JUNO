let keyGen = require('keygenerator');
//generate 25 character key for historical data
function generateHistoryKey(){
    return keyGen._({ length: 25 });
}

export default generateHistoryKey;
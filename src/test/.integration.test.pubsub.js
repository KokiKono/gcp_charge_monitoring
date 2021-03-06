const childProsess = require('child_process');
const test = require('ava');

const pJson = require('../package.json');
const function_name = pJson.config.function_name;

test('charge monitoring: shoud print over amount', async (t) => {
    const startTime = new Date(Date.now()).toISOString();
    const data = require('./charge_amount_data').over_data;

    // mock Pub/Sub call, as the emulator doesn't listen to Pub/Sub topics
    const encodeData = Buffer.from(JSON.stringify(data)).toString('base64');
    const pubsubData = JSON.stringify({data: encodeData});
    childProsess.execSync(`functions call ${function_name} --data '${pubsubData}'`);
    
    // Check the emulator's logs
    const logs = childProsess.execSync(`functions logs read ${function_name} --start-time ${startTime}`).toString();
    t.true(logs.includes('over amount'));
});

const test = require('ava');
const sinon = require('sinon');

const chargeMonitoring = require('..').chargeMonitoring;
const consoleLog = sinon.stub(console, 'log');

test.cb('charge monitoring: over amount case', t => {
    const data = require('./charge_amount_data').over_data;
    const event = {
        data: {
            data: Buffer.from(JSON.stringify(data)).toString('base64'),
        }
    };

    chargeMonitoring(event, () => {
        t.true(consoleLog.calledWith(`over amount`));
        t.end();
    });
});

test('monitor logic', t => {
    const isCostOver = require('..').isCostOver;

    t.true(isCostOver(100, 200));
    t.false(isCostOver(200, 100));
});
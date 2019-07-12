const test = require('ava');
const sinon = require('sinon');
const moment = require('moment');

const chargeMonitoring = require('..').chargeMonitoring;
const consoleLog = sinon.stub(console, 'log');

test.cb('charge monitoring: over amount case', t => {
    const data = {
        budgetDisplayName: 'sample',
        alertThresholdExceeded: 1,
        costAmount: 2000,   // 発生した費用
        costIntervalStart: moment().format(),
        budgetAmount: 1000, // 予算
        budgetAmountType: '',
        currencyCode: ''
    };

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
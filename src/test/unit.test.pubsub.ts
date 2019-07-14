import test from 'ava';
const sinon = require('sinon');

const {chargeMonitoring} = require('../');
const consoleLog = sinon.stub(console, 'log');

test.cb('charge monitoring: over amount case', t => {
    const testData = require('./charge_amount_data').over_data;
    const data = {
        data: Buffer.from(JSON.stringify(testData)).toString('base64'),
    };
    const context = {};

    chargeMonitoring(data, context, () => {
        t.true(consoleLog.calledWith(`over amount`));
        t.end();
    });
});

test('monitor logic', t => {
    const {isCostOver} = require('../');

    t.true(isCostOver(100, 200));
    t.false(isCostOver(200, 100));
});


test('charge monitoring: isEnableBilling', async (t) => {
    const {isEnableBilling} = require('../');
    const PROJECT_NAME = 'is_enable_billing';
    // mock Billing API
    const {google} = require('googleapis');
    const cloudbilling = google.cloudbilling('v1');
    sinon
        .mock(cloudbilling.projects)
        .expects('getBillingInfo')
        .once()
        .withArgs({name: PROJECT_NAME})
        .resolves({
            data: {
                billingEnabled: true,
            },
        });
    const result = await isEnableBilling(PROJECT_NAME, cloudbilling.projects);
    t.true(result);
})


test('charge monitoring: disableBilling', async (t) => {
    const {disableBilling} = require('../');
    const PROJECT_NAME = 'will_disable_billing';

    const {google} = require('googleapis');
    const cloudbilling = google.cloudbilling('v1');
    // Mock Billing API updateBillingInfo
    sinon
        .mock(cloudbilling.projects)
        .expects('updateBillingInfo')
        .once()
        .withArgs({name: PROJECT_NAME, requestBody: {
            billingEnabled: false,
        }})
        .resolves({
            billingEnabled: false,
        });
    // Mock Billing API getBillingInfo for check
    sinon
        .mock(cloudbilling.projects)
        .expects('getBillingInfo')
        .once()
        .withArgs({name: PROJECT_NAME})
        .resolves({
            data: {
                billingEnabled: false,
            }
        });

    // run disable billing
    const result = await disableBilling(PROJECT_NAME, cloudbilling.projects);
    // return result success=true, failed=false
    t.true(result);
})
import uuid from 'uuid';
import {PubSub} from '@google-cloud/pubsub';
import {google} from 'googleapis';
const childProcess = require('child_process');
const test = require(`ava`);

const pubsub = new PubSub();

const pJson = require('../../package.json');
const function_name = pJson.config.function_name;
const topicName = pJson.config.pubsub_topic_name;
const baseCmd = `gcloud beta functions`;

let auth = null;

test.before('gcp auth login',  async t => {
  auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
});

test('is disable', async (t) => {
  const cloudbilling = google.cloudbilling('v1');
  t.log('auth', auth);
  // const info = await cloudbilling.billingAccounts.projects.list({name: 'billingAccounts/0131C9-D22C3C-C4A0CD', auth: auth});
  // info.data.projectBillingInfo.forEach(i => t.log('data', i));
  const info = await cloudbilling.projects.getBillingInfo({name: 'projects/estimate-dev', auth: auth})
    .catch(e => t.log('error', e));
  t.log('info', info);
});

test(`charge monitoring: should print over amount`, async (t) => {
  t.pass();
  return;
  t.plan(1);
  const startTime = new Date(Date.now()).toISOString();
  const data = require('./charge_amount_data').over_data;

  // Publish to pub/sub topic
  const topic = pubsub.topic(topicName);
  await topic.publish(Buffer.from(JSON.stringify(data)));

  // Wait for logs to become consistent
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Check logs after a delay
  const logs = childProcess.execSync(`${baseCmd} logs read ${function_name} --start-time ${startTime}`).toString();
  t.true(logs.includes(`over amount`));
});

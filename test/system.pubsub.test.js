const childProcess = require(`child_process`);
const test = require(`ava`);
const uuid = require(`uuid`);
const {PubSub} = require(`@google-cloud/pubsub`);
const pubsub = new PubSub();

const pJson = require('../package.json');
const function_name = pJson.config.function_name;
const topicName = pJson.config.pubsub_topic_name;
const baseCmd = `gcloud beta functions`;

test(`charge monitoring: should print over amount`, async (t) => {
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
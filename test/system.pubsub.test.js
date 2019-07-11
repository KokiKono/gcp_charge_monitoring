const childProcess = require(`child_process`);
const test = require(`ava`);
const uuid = require(`uuid`);
const {PubSub} = require(`@google-cloud/pubsub`);
const pubsub = new PubSub();

const topicName = 'charge_alert';
const baseCmd = `gcloud beta functions`;

test(`helloPubSub: should print a name`, async (t) => {
  t.plan(1);
  const startTime = new Date(Date.now()).toISOString();
  const name = uuid.v4();

  // Publish to pub/sub topic
  const topic = pubsub.topic(topicName);
  await topic.publish(Buffer.from(name));

  // Wait for logs to become consistent
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Check logs after a delay
  const logs = childProcess.execSync(`${baseCmd} logs read helloPubSub --start-time ${startTime}`).toString();
  t.true(logs.includes(`Hello, ${name}!`));
});

test(`helloPubSub: should print hello world`, async (t) => {
  t.plan(1);
  const startTime = new Date(Date.now()).toISOString();

  // Publish to pub/sub topic
  const topic = pubsub.topic(topicName);
  await topic.publish(Buffer.from(''), { a: 'b' });

  // Wait for logs to become consistent
  await new Promise(resolve => setTimeout(resolve, 15000));

  // Check logs after a delay
  const logs = childProcess.execSync(`${baseCmd} logs read helloPubSub --start-time ${startTime}`).toString();
  t.true(logs.includes('Hello, World!'));
});
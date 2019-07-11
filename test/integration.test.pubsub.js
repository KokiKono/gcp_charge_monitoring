const childProcess = require(`child_process`);
const test = require(`ava`);
const uuid = require(`uuid`);

test(`helloPubSub: should print a name`, async (t) => {
  t.plan(1);
  const startTime = new Date(Date.now()).toISOString();
  const name = uuid.v4();

  // Mock Pub/Sub call, as the emulator doesn't listen to Pub/Sub topics
  const encodedName = Buffer.from(name).toString(`base64`);
  const data = JSON.stringify({ data: encodedName });
  childProcess.execSync(`functions call helloPubSub --data '${data}'`);

  // Check the emulator's logs
  const logs = childProcess.execSync(`functions logs read helloPubSub --start-time ${startTime}`).toString();
  t.true(logs.includes(`Hello, ${name}!`));
});

test(`helloPubSub: should print hello world`, async (t) => {
  t.plan(1);
  const startTime = new Date(Date.now()).toISOString();

  // Mock Pub/Sub call, as the emulator doesn't listen to Pub/Sub topics
  childProcess.execSync(`functions call helloPubSub --data {}`);

  // Check the emulator's logs
  const logs = childProcess.execSync(`functions logs read helloPubSub --start-time ${startTime}`).toString();
  t.true(logs.includes(`Hello, World!`));
});
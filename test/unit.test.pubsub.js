const test = require(`ava`);
const uuid = require(`uuid`);
const sinon = require(`sinon`);

const helloPubSub = require(`..`).helloPubSub;
const consoleLog = sinon.stub(console, 'log');

test.cb(`helloPubSub: should print a name`, t => {
  t.plan(1);

  // Initialize mocks
  const name = uuid.v4();
  const event = {
    data: {
      data: Buffer.from(name).toString(`base64`)
    }
  };

  // Call tested function and verify its behavior
  helloPubSub(event, () => {
    t.true(consoleLog.calledWith(`Hello, ${name}!`));
    t.end();
  });
});

test.cb(`helloPubSub: should print hello world`, t => {
  t.plan(1);

  // Initialize mocks
  const event = {
    data: {}
  };

  // Call tested function and verify its behavior
  helloPubSub(event, () => {
    t.true(consoleLog.calledWith(`Hello, World!`));
    t.end();
  });
});
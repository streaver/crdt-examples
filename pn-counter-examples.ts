import PNCounter from './PNCounter';

const NUMBER_OF_CLIENTS = 5;

const client1 = new PNCounter(0, NUMBER_OF_CLIENTS);
const client2 = new PNCounter(1, NUMBER_OF_CLIENTS);
const client3 = new PNCounter(2, NUMBER_OF_CLIENTS);
const client4 = new PNCounter(3, NUMBER_OF_CLIENTS);
const client5 = new PNCounter(4, NUMBER_OF_CLIENTS);

client1.increment(4);
client2.decrement(3);
client2.increment(1);
client1.decrement(2);
client1.increment(1);
client3.increment(10);
client3.increment(5);

console.log({
  client1: client1.query(),
  client2: client2.query(),
  client3: client3.query(),
  client4: client4.query(),
  client5: client5.query(),
});

const clients = [client1, client2, client3, client4, client5];

clients.forEach((client) => {
  client1.merge(client);
  client2.merge(client);
  client3.merge(client);
  client4.merge(client);
  client5.merge(client);
});

console.log({
  client1: client1.query(),
  client2: client2.query(),
  client3: client3.query(),
  client4: client4.query(),
  client5: client5.query(),
});
